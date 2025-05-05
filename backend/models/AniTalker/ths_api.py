from flask import Flask, request, jsonify, send_file # type: ignore
import os
import sys
import traceback

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'code')))

from demo import run_from_args # type: ignore
from werkzeug.utils import secure_filename

#suppress warning and errors
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)


app = Flask(__name__)


UPLOAD_FOLDER = './uploads'
OUTPUT_FOLDER = './outputs'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/")
def check_active():
    return jsonify({"status": "active"})


@app.route('/gen', methods=['POST'])
def generate_video():
    if 'audio' not in request.files or 'image' not in request.files:
        return {'error': 'Missing image or audio'}, 400
    
    image_file = request.files['image']
    audio_file = request.files['audio']

    image_filename = secure_filename(image_file.filename)
    image_name = os.path.splitext(image_filename)[0]

    fake_image_name = f'{image_filename}'
    fake_audio_name = f'{image_name}.wav'

    result_path = os.path.join(OUTPUT_FOLDER, f'{image_name}')
    image_path = os.path.join(UPLOAD_FOLDER, fake_image_name)
    audio_path = os.path.join(UPLOAD_FOLDER, fake_audio_name)

    os.makedirs(result_path, exist_ok=True)
    image_file.save(image_path)
    audio_file.save(audio_path)

    args = {
        'infer_type': 'hubert_full_control',
        'stage1_checkpoint_path': 'ckpts/stage1.ckpt',
        'stage2_checkpoint_path': 'ckpts/stage2_full_control_hubert.ckpt',
        'test_image_path': image_path,
        'test_audio_path': audio_path,
        'result_path' : result_path,
        'device' : 'cpu',
        'face_scale' : 0.3,
        'step_T' : 100,
        # 'face_sr': True #enable this only if u have gpu
    }


    try:
        print("Generating Video...")
        run_from_args(args)
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f'Video generation failed: {str(e)}'}), 500


    video_file = None
    for file in os.listdir(result_path):
        if file.endswith('.mp4'):
            video_file = os.path.join(result_path, file)
            break


    if not video_file or not os.path.exists(video_file):
        return jsonify({'error': 'Video file not found'}), 500
                              
    return send_file(video_file, mimetype='video/mp4')
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6789)