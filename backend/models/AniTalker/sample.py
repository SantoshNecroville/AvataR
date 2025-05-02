# run_infer.py
import argparse

def main(args):
    print("Infer type:", args.infer_type)
    print("Image path:", args.test_image_path)
    # Add your full inference logic here

def get_arg_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('--infer_type', type=str, default='mfcc_pose_only', help='mfcc_pose_only or mfcc_full_control')
    parser.add_argument('--test_image_path', type=str, help='Path to the portrait')
    parser.add_argument('--test_audio_path', type=str, help='Path to the driven audio')
    parser.add_argument('--test_hubert_path', type=str, help='Path to the driven audio(hubert type). Not needed for MFCC')
    parser.add_argument('--result_path', type=str, default='./results/', help='Type of inference')
    parser.add_argument('--stage1_checkpoint_path', type=str, default='./ckpts/stage1.ckpt', help='Path to the checkpoint of Stage1')
    parser.add_argument('--stage2_checkpoint_path', type=str, default='./ckpts/pose_only.ckpt', help='Path to the checkpoint of Stage2')
    parser.add_argument('--seed', type=int, default=0, help='seed for generations')
    parser.add_argument('--control_flag', action='store_true', help='Whether to use control signal or not')
    parser.add_argument('--pose_yaw', type=float, default=0.25, help='range from -1 to 1 (-90 ~ 90 angles)')
    parser.add_argument('--pose_pitch', type=float, default=0, help='range from -1 to 1 (-90 ~ 90 angles)')
    parser.add_argument('--pose_roll', type=float, default=0, help='range from -1 to 1 (-90 ~ 90 angles)')
    parser.add_argument('--face_location', type=float, default=0.5, help='range from 0 to 1 (from left to right)')
    parser.add_argument('--pose_driven_path', type=str, default='xxx', help='path to pose numpy, shape is (T, 3). You can check the following code https://github.com/liutaocode/talking_face_preprocessing to extract the yaw, pitch and roll.')
    parser.add_argument('--face_scale', type=float, default=0.5, help='range from 0 to 1 (from small to large)')
    parser.add_argument('--step_T', type=int, default=50, help='Step T for diffusion denoising process')
    parser.add_argument('--image_size', type=int, default=256, help='Size of the image. Do not change.')
    parser.add_argument('--device', type=str, default='cuda:0', help='Device for computation')
    parser.add_argument('--motion_dim', type=int, default=20, help='Dimension of motion. Do not change.')
    parser.add_argument('--decoder_layers', type=int, default=2, help='Layer number for the conformer.')
    parser.add_argument('--face_sr', action='store_true', help='Face super-resolution (Optional). Please install GFPGAN first')
    return parser

if __name__ == '__main__':
    parser = get_arg_parser()
    args = parser.parse_args()
    main(args)
