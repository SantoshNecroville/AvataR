import os
import sys
import warnings
import traceback
from werkzeug.utils import secure_filename


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'code')))


from demo import run_from_args  # type: ignore


os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

UPLOAD_FOLDER = './uploads'
OUTPUT_FOLDER = './outputs'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def run_ths(image_path_input: str, audio_path_input: str, device: str = "cpu") -> str:
    try:
        image_filename = secure_filename(os.path.basename(image_path_input))
        image_name = os.path.splitext(image_filename)[0]

        image_dest_path = os.path.join(UPLOAD_FOLDER, image_filename)
        audio_dest_path = os.path.join(UPLOAD_FOLDER, f"{image_name}.wav")
        result_path = os.path.join(OUTPUT_FOLDER, image_name)

        os.makedirs(result_path, exist_ok=True)

        os.replace(image_path_input, image_dest_path)
        os.replace(audio_path_input, audio_dest_path)

        base_dir = os.path.dirname(os.path.abspath(__file__))
        ckpt_dir = os.path.join(base_dir, 'ckpts')

        args = {
            'infer_type': 'hubert_full_control',
            'stage1_checkpoint_path': os.path.join(ckpt_dir, 'stage1.ckpt'),
            'stage2_checkpoint_path': os.path.join(ckpt_dir, 'stage2_full_control_hubert.ckpt'),
            'test_image_path': image_dest_path,
            'test_audio_path': audio_dest_path,
            'test_hubert_path': '',
            'result_path': result_path,
            'device': device,
        }

        print("Generating video...")
        run_from_args(args)

        video_file = next((os.path.join(result_path, f) for f in os.listdir(result_path) if f.endswith('.mp4')), None)

        if not video_file or not os.path.exists(video_file):
            raise FileNotFoundError("Generated video not found.")

        print(f"Generated video saved at: {video_file}")
        return video_file

    except Exception as e:
        traceback.print_exc()
        raise RuntimeError(f"Video generation failed: {e}")