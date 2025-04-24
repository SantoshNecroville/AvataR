import os
from flask import Flask, request, jsonify, send_file # type: ignore
from werkzeug.utils import secure_filename
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'models')))

from TTS.Zonos.tts import run_tts # type: ignore
from THS.AniTalker.ths import run_ths # type: ignore


app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
OUTPUT_FOLDER = './outputs'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/generate', methods=['POST'])
def generate():
    if 'image' not in request.files or 'text' not in request.form or 'audio' not in request.files:
        return jsonify({'error': 'Missing required inputs'}), 400

    image_file = request.files['image']
    audio_file = request.files['audio']
    text_input = request.form['text']

    image_filename = secure_filename(image_file.filename)
    audio_filename = secure_filename(audio_file.filename)

    image_path = os.path.join(UPLOAD_FOLDER, image_filename)
    audio_path = os.path.join(UPLOAD_FOLDER, audio_filename)

    image_file.save(image_path)
    audio_file.save(audio_path)

    tts_output_path = os.path.join(OUTPUT_FOLDER, 'generated_audio.wav')
    try:
        run_tts(text_input, audio_path, tts_output_path)
        video_path = run_ths(image_path, tts_output_path)
        return send_file(video_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
