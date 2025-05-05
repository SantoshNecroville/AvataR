import os
from flask import Flask, request, jsonify, send_file # type: ignore
from werkzeug.utils import secure_filename # type: ignore
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'models')))
from Zonos.tts import run_tts # type: ignore
from AniTalker.ths import run_ths # type: ignore

from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = './uploads'
OUTPUT_FOLDER = './outputs'


os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def save_file(file, folder):
    filename = secure_filename(file.filename)
    file_path = os.path.join(folder, filename)
    file.save(file_path)
    return file_path


def error_response(message, status_code=400):
    return jsonify({'error': message}), status_code


@app.route("/")
def check_active():
    return jsonify({"status": "active"})


@app.route('/tts', methods=['POST'])
def only_tts():

    if 'text' not in request.form or 'audio' not in request.files:
        return error_response('Missing required inputs')

    try:
        text_input = request.form['text']
        audio_file = request.files['audio']

        audio_path = save_file(audio_file, UPLOAD_FOLDER)
        tts_output_path = os.path.join(OUTPUT_FOLDER, 'generated_audio.wav')

        run_tts(text_input, audio_path, tts_output_path)

        return send_file(tts_output_path, as_attachment=True)
    
    except Exception as e:
        return error_response(f"TTS Error: {str(e)}", 500)


@app.route('/ths', methods=['POST'])
def only_ths():

    if 'image' not in request.files or 'audio' not in request.files:
        return error_response('Missing required inputs')

    try:
        image_file = request.files['image']
        image_path = save_file(image_file, UPLOAD_FOLDER)

        audio_file = request.files['audio']
        audio_path = save_file(audio_file,UPLOAD_FOLDER)
        
        video_path = run_ths(image_path, audio_path)

        return send_file(video_path, as_attachment=True)
    
    except Exception as e:
        return error_response(f"THS Error: {str(e)}", 500)


@app.route('/inf', methods=['POST'])
def generate():

    if 'image' not in request.files or 'text' not in request.form or 'audio' not in request.files:
        return error_response('Missing required inputs: image, text, or audio file')

    try:
        image_file = request.files['image']
        audio_file = request.files['audio']
        text_input = request.form['text']

        image_path = save_file(image_file, UPLOAD_FOLDER)
        audio_path = save_file(audio_file, UPLOAD_FOLDER)

        tts_output_path = os.path.join(OUTPUT_FOLDER, 'generated_audio.wav')

        run_tts(text_input, audio_path, tts_output_path)
        video_path = run_ths(image_path, tts_output_path)

        return send_file(video_path, as_attachment=True)
    
    except Exception as e:
        return error_response(f"Error generating content: {str(e)}", 500)


if __name__ == '__main__':
    app.run(port=1000, threaded=False)
