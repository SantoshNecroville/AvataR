from flask import Flask, request, jsonify, send_file # type: ignore
from flask_cors import CORS # type: ignore
import sys
import os


import torch._dynamo
torch._dynamo.config.suppress_errors = True

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import logging
logging.getLogger("torch._dynamo").setLevel(logging.CRITICAL)

warnings.filterwarnings("ignore", category=UserWarning)


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'zonos')))

import torch
import torchaudio
from zonos.model import Zonos # type: ignore
from zonos.conditioning import make_cond_dict # type: ignore
from zonos.utils import DEFAULT_DEVICE as device # type: ignore


app = Flask(__name__)
CORS(app)


try:
    print("Downloading model...")
    model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-transformer", device=device)
    print("\nModel download and integrated succesfully!!!\n")

except:
    print("Error in downloading model...")


@app.route("/")
def check_active():
    return jsonify({"status": "active"})


if not os.path.exists("outputs"):
    os.makedirs("outputs")


@app.route("/inf", methods=["POST"])
def TTS():
    print(request.form)
    if "audio" not in request.files or "text" not in request.form:
        return jsonify({"error": "Please provide both an audio file and text"}), 400

    audio_file = request.files["audio"]
    text = request.form["text"]


    try:
        print("Sampling the audio...")
        wav, sampling_rate = torchaudio.load(audio_file)
        speaker = model.make_speaker_embedding(wav, sampling_rate)

        cond_dict = make_cond_dict(text=text, speaker=speaker, language="en-us")
        conditioning = model.prepare_conditioning(cond_dict)

    except Exception as e:
        return jsonify({"status": f"Error in sampling: {str(e)}"}), 500


    try:
        print("Generating audio...")
        codes = model.generate(conditioning)
        wavs = model.autoencoder.decode(codes).cpu()


    except Exception as e:
        return jsonify({"status": f"Error in generating: {str(e)}"}), 500


    output_path = "./outputs/output.wav"
    torchaudio.save(output_path, wavs[0], model.autoencoder.sampling_rate)

    return send_file(output_path, as_attachment=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1234, debug=False)