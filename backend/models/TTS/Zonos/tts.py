import sys
import os
import torch
import torchaudio
import torch._dynamo
import warnings
import logging


torch._dynamo.config.suppress_errors = True
warnings.filterwarnings("ignore", category=UserWarning)
logging.getLogger("torch._dynamo").setLevel(logging.CRITICAL)


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'zonos')))


from zonos.model import Zonos  # type: ignore
from zonos.conditioning import make_cond_dict  # type: ignore
from zonos.utils import DEFAULT_DEVICE as device  # type: ignore


if not os.path.exists("outputs"):
    os.makedirs("outputs")


try:
    print("Downloading model...")
    model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-transformer", device=device)
    print("Model download and integrated successfully!")
except:
    print("Error in downloading model...")

def run_tts(text: str, reference_audio_path: str, output_path: str = "./outputs/output.wav") -> str:
    try:
        print("Loading reference audio...")
        wav, sampling_rate = torchaudio.load(reference_audio_path)
        speaker = model.make_speaker_embedding(wav, sampling_rate)

        cond_dict = make_cond_dict(text=text, speaker=speaker, language="en-us")
        conditioning = model.prepare_conditioning(cond_dict)

        print("Generating audio...")
        codes = model.generate(conditioning)
        wavs = model.autoencoder.decode(codes).cpu()

        torchaudio.save(output_path, wavs[0], model.autoencoder.sampling_rate)

        print(f"Generated audio saved at: {output_path}")
        return output_path

    except Exception as e:
        raise RuntimeError(f"TTS generation failed: {e}")