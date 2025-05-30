# Steps for Running Zonos TTS

### 1. Clone the Repository

```bash
git clone https://github.com/SantoshNecroville/AvataR.git
```


### 2. Create a Environment

```bash
conda create -n zono python==3.10.16
conda init
conda activate zono
```

### 3. Install Requirements

```bash
cd models/Zonos
pip install -r req.txt
cd Zonos
pip install -e .
```

## Inference

For running on colab, import [inference](inference.ipynb) to Colab and run all the cells directly (Use GPU/TPU for faster inference).

## REST Api

```python
python api.py
```

## Error Rectification

### numpy errors:
If you face numpy-related errors, use the following version of numpy:
    
    pip install numpy==1.24.0

### eSpeak errors:
1. Install espeak from [Download Espeak](https://espeak.sourceforge.net/download.html) and espeak ng from [Download Espeak-NG](https://github.com/espeak-ng/espeak-ng/releases/download/1.52.0/espeak-ng.msi)
2. Run the .exe file
3. Set Path variables
    - ADD "C:\Program Files (x86)\eSpeak" to Path
    - PHONEMIZER_ESPEAK_PATH -- C:\Program Files (x86)\eSpeak\command_line\espeak.exe
    - PHONEMIZER_ESPEAK_LIBRARY" -- C:\Program Files (x86)\eSpeak\espeak_sap.dll
    - Test with `espeak --version` on cmd

### Compiler cl errors:
```bash
import torch._dynamo
torch._dynamo.config.suppress_errors = True

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import logging
logging.getLogger("torch._dynamo").setLevel(logging.CRITICAL)

warnings.filterwarnings("ignore", category=UserWarning)
