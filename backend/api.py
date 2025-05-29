import os
from flask import Flask, request, jsonify, send_file # type: ignore
from werkzeug.utils import secure_filename
import sys
import cv2

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


def crop_face(image_path, crop_size=(256, 256)):
    image = cv2.imread(image_path)
    if image is None:
        return image_path

    image = cv2.resize(image, (image.shape[1]*2, image.shape[0]*2), interpolation=cv2.INTER_CUBIC)
    h, w, _ = image.shape

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        return image_path

    x, y, width, height = faces[0]
    margin = 0.5
    x1 = max(0, int(x - width * margin))
    y1 = max(0, int(y - height * margin))
    x2 = min(w, int(x + width * (1 + margin)))
    y2 = min(h, int(y + height * (1 + margin)))

    face_crop = image[y1:y2, x1:x2]
    face_crop_resized = cv2.resize(face_crop, crop_size)

    cv2.imwrite(image_path, face_crop_resized)

    return image_path


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


@app.route("/crop", methods=['POST'])
def crop():
    if 'image' not in request.files:
        return error_response('Missing required inputs')

    try:
        image_file = request.files['image']
        image_path = save_file(image_file, UPLOAD_FOLDER)
        image_path = crop_face(image_path)
        return send_file(image_path, as_attachment=True)

    except Exception as e:
        return error_response(f"Crop Error: {str(e)}", 500)



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

        image_path = crop_face(image_path=image_path)

        audio_file = request.files['audio']
        audio_path = save_file(audio_file, UPLOAD_FOLDER)

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

        crop_flag = request.form.get('crop', 'false').lower() == 'true'


        image_path = save_file(image_file, UPLOAD_FOLDER)
        
        if crop_flag:
            print("Cropping enabled...")
            image_path = crop_face(image_path=image_path)

        audio_path = save_file(audio_file, UPLOAD_FOLDER)
        tts_output_path = os.path.join(OUTPUT_FOLDER, 'generated_audio.wav')

        run_tts(text_input, audio_path, tts_output_path)
        video_path = run_ths(image_path, tts_output_path)

        return send_file(video_path, as_attachment=True)

    except Exception as e:
        return error_response(f"Error generating content: {str(e)}", 500)


if __name__ == '__main__':
    app.run(port=1000, threaded=False, debug=True)
