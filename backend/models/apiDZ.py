from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sys
import os
from flask import send_file
import subprocess
import uuid

import torch._dynamo
torch._dynamo.config.suppress_errors = True

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import logging
logging.getLogger("torch._dynamo").setLevel(logging.CRITICAL)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings("ignore", category=UserWarning)

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'Zonos', 'Zonos')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'ditto-talkinghead')))

import torch
import torchaudio
from Zonos.Zonos.zonos.model import Zonos
from Zonos.Zonos.zonos.conditioning import make_cond_dict
from Zonos.Zonos.zonos.utils import DEFAULT_DEVICE as device

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploadsDZ'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# UPLOAD_FOLDER = './uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    
def generate_tts_audio(audio_file, text, output_path="./outputs/output.wav"):
    try:
        wav, sampling_rate = torchaudio.load(audio_file)
        speaker = model.make_speaker_embedding(wav, sampling_rate)

        cond_dict = make_cond_dict(text=text, speaker=speaker, language="en-us")
        conditioning = model.prepare_conditioning(cond_dict)

        codes = model.generate(conditioning)
        wavs = model.autoencoder.decode(codes).cpu()

        torchaudio.save(output_path, wavs[0], model.autoencoder.sampling_rate)
        return output_path, None

    except Exception as e:
        return None, str(e)

def run_ditto_inference(image_file, audio_file):
    try:
        uid = str(uuid.uuid4())[:8]
        image_path = os.path.join("uploadsDZ", f"{uid}_image.png")
        audio_path = os.path.join("uploadsDZ", f"{uid}_audio.wav")
        output_path = os.path.join("outputs", f"{uid}_result.mp4")

        image_file.save(image_path)
        audio_file.save(audio_path)

        command = [
            "python", "inference.py",
            "--data_root", "./checkpoints/ditto_trt_Ampere_Plus",
            "--cfg_pkl", "./checkpoints/ditto_cfg/v0.4_hubert_cfg_trt.pkl",
            "--audio_path", audio_path,
            "--source_path", image_path,
            "--output_path", output_path
        ]

        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            return None, f"Inference failed: {result.stderr}"

        return output_path, None

    except Exception as e:
        return None, str(e)

@app.route("/inf", methods=["POST"])
def TTS():
    print(request.form)
    if "audio" not in request.files or "text" not in request.form:
        return jsonify({"error": "Please provide both an audio file and text"}), 400

    audio_file = request.files["audio"]
    text = request.form["text"]

    output_path = "./outputs/output.wav"
    result_path, error = generate_tts_audio(audio_file, text, output_path)

    if error:
        return jsonify({"status": f"TTS generation failed: {error}"}), 500

    return send_file(result_path, as_attachment=True)


@app.route('/run-ditto', methods=['POST'])
def run_ditto_api():
    image_file = request.files.get('image')
    audio_file = request.files.get('audio')

    if not image_file or not audio_file:
        return jsonify({'error': 'Both image and audio files are required'}), 400

    output_path, error = run_ditto_inference(image_file, audio_file)

    if error:
        return jsonify({'error': error}), 500

    return send_file(output_path, mimetype='video/mp4', as_attachment=True, download_name=os.path.basename(output_path))



if __name__ == "__main__":
    app.run(port=2000, debug=True)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    