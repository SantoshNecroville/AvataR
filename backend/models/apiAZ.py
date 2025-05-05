from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sys
import os
from flask import send_file

import torch._dynamo
torch._dynamo.config.suppress_errors = True

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import logging
logging.getLogger("torch._dynamo").setLevel(logging.CRITICAL)

warnings.filterwarnings("ignore", category=UserWarning)

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'Zonos', 'Zonos')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'AniTalker','code')))

import torch
import torchaudio
from Zonos.Zonos.zonos.model import Zonos
from Zonos.Zonos.zonos.conditioning import make_cond_dict
from Zonos.Zonos.zonos.utils import DEFAULT_DEVICE as device

from AniTalker.code.demo import main,get_arg_parser

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploadsAZ'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
        wav, sampling_rate = torchaudio.load(audio_file)
        speaker = model.make_speaker_embedding(wav, sampling_rate) 

        cond_dict = make_cond_dict(text=text, speaker=speaker, language="en-us")
        conditioning = model.prepare_conditioning(cond_dict)

    except Exception as e:
        return jsonify({"status": f"Error in sampling: {str(e)}"}), 500

    try:
        codes = model.generate(conditioning)
        wavs = model.autoencoder.decode(codes).cpu()

    except Exception as e:
        return jsonify({"status": f"Error in generating: {str(e)}"}), 500

    output_path = "./outputs/output.wav"
    torchaudio.save(output_path, wavs[0], model.autoencoder.sampling_rate)

    return send_file(output_path, as_attachment=True)


# @app.route('/run', methods=['POST'])
# def run_inference():
#     image_file = request.files.get('image')
#     audio_file = request.files.get('audio')

#     if not image_file or not audio_file:
#         return jsonify({'error': 'Both image and audio files are required'}), 400

#     image_filename = os.path.splitext(image_file.filename)[0]
#     audio_filename = os.path.splitext(audio_file.filename)[0]

#     image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
#     audio_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
#     image_file.save(image_path)
#     audio_file.save(audio_path)

#     infer_type = request.form.get('infer_type', 'hubert_audio_only')
#     seed = int(request.form.get('seed', 0))

#     parser = get_arg_parser()
#     base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
#     ckpt_dir = os.path.join(base_dir, "ckpts")
#     output_dir = os.path.join(base_dir, "output")

#     stage1_ckpt = os.path.join(ckpt_dir, "stage1.ckpt")
#     stage2_ckpt = os.path.join(ckpt_dir, "stage2_audio_only_hubert.ckpt")  

#     args_list = [
#         "--test_image_path", image_path,
#         "--test_audio_path", audio_path,
#         "--infer_type", infer_type,
#         "--seed", str(seed),
#         "--device", "cpu",
#         "--stage1_checkpoint_path", stage1_ckpt,
#         "--stage2_checkpoint_path", stage2_ckpt,
#         "--result_path", output_dir
#     ]

#     try:
#         args = parser.parse_args(args_list)
#         main(args)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

#     # Construct the known output video name
#     output_filename = f"{image_filename}-{audio_filename}.mp4"
#     output_filepath = os.path.join(output_dir, output_filename)

#     if not os.path.exists(output_filepath):
#         return jsonify({'error': 'Output video not found'}), 500

#     return send_file(output_filepath, mimetype='video/mp4', as_attachment=True, download_name=output_filename)


if __name__ == "__main__":
    app.run(port=1235, debug=True)