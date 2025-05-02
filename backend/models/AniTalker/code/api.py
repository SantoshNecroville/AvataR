from flask import Flask
from demo import main,get_arg_parser
from flask import request, jsonify
from flask_cors import CORS 
from flask import send_file
import os

#suppress warning and errors
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Hello, from flask'

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/run', methods=['POST'])
def run_inference():
    image_file = request.files.get('image')
    audio_file = request.files.get('audio')

    if not image_file or not audio_file:
        return jsonify({'error': 'Both image and audio files are required'}), 400

    image_filename = os.path.splitext(image_file.filename)[0]
    audio_filename = os.path.splitext(audio_file.filename)[0]

    image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    audio_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    image_file.save(image_path)
    audio_file.save(audio_path)

    infer_type = request.form.get('infer_type', 'hubert_audio_only')
    seed = int(request.form.get('seed', 0))

    parser = get_arg_parser()
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    ckpt_dir = os.path.join(base_dir, "ckpts")
    output_dir = os.path.join(base_dir, "output")

    stage1_ckpt = os.path.join(ckpt_dir, "stage1.ckpt")
    stage2_ckpt = os.path.join(ckpt_dir, "stage2_audio_only_hubert.ckpt")  

    args_list = [
        "--test_image_path", image_path,
        "--test_audio_path", audio_path,
        "--infer_type", infer_type,
        "--seed", str(seed),
        "--device", "cpu",
        "--stage1_checkpoint_path", stage1_ckpt,
        "--stage2_checkpoint_path", stage2_ckpt,
        "--result_path", output_dir
    ]

    try:
        args = parser.parse_args(args_list)
        main(args)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Construct the known output video name
    output_filename = f"{image_filename}-{audio_filename}.mp4"
    output_filepath = os.path.join(output_dir, output_filename)

    if not os.path.exists(output_filepath):
        return jsonify({'error': 'Output video not found'}), 500

    return send_file(output_filepath, mimetype='video/mp4', as_attachment=True, download_name=output_filename)


if __name__ == '__main__':
    app.run(port=4321,debug=True)
    
    
    
    
    
    







# @app.route('/run', methods=['POST'])
# def run_inference():
#     image_file = request.files.get('image')
#     audio_file = request.files.get('audio')

#     if not image_file or not audio_file:
#         return jsonify({'error': 'Both image and audio files are required'}), 400

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
#     stage2_ckpt = os.path.join(ckpt_dir,"stage2_audio_only_hubert.ckpt")

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
#     args = parser.parse_args(args_list)
#     main(args)

#     return jsonify({'status': 'success', 'message': 'Inference completed'})