from typing import Any
import modal 

""" 
Config script for our custom LLM. When deployed, this LLM will be called as if
you were to make a API call to openai.

I had a issue with modal not being seen by the interpreter. Make sure to set the Interpreter to:

CS 342/Project2_WeatherApp/llm/venv/bin/python
"""

#Default image from the example code.
vllm_image = (
    modal.Image.from_registry("nvidia/cuda:12.8.0-devel-ubuntu22.04", add_python="3.12")
    .entrypoint([])
    .uv_pip_install(
        "vllm==0.13.0",
        "huggingface-hub==0.36.0",
    )
    .env({"HF_XET_HIGH_PERFORMANCE": "1"})  # faster model transfers
)

MODEL_NAME = "openai/gpt-oss-20b" #Chinese models don't got rn. USA!!!!!!!

MODEL_REVISION = "main"  # avoid nasty surprises when repos update!

#Cache our LLM so that we don't need to burn tokens every time the container is up.
hf_cache_vol = modal.Volume.from_name("huggingface-cache", create_if_missing=True)
vllm_cache_vol = modal.Volume.from_name("vllm-cache", create_if_missing=True)

#IMPORTANT: Make sure to turn on to true for presentation!!!!!!!
FAST_BOOT = True

app = modal.App("CS342_WeatherApp_vLLM")

N_GPU = 1
MINUTES = 60  # seconds
VLLM_PORT = 8000

@app.function(
    image=vllm_image,
    gpu=f"H100:{N_GPU}",
    scaledown_window=15 * MINUTES,  # how long should we stay up with no requests?
    timeout=10 * MINUTES,  # how long should we wait for container start?
    volumes={
        "/root/.cache/huggingface": hf_cache_vol,
        "/root/.cache/vllm": vllm_cache_vol,
    },
)

@modal.concurrent(  # how many requests can one replica handle? tune carefully!
    max_inputs=2
)

@modal.web_server(port=VLLM_PORT, startup_timeout=10 * MINUTES)
def serve():
    import subprocess

    cmd = [
        "vllm",
        "serve",
        "--uvicorn-log-level=info",
        MODEL_NAME,
        "--revision",
        MODEL_REVISION,
        "--served-model-name",
        MODEL_NAME,
        "llm",
        "--host",
        "0.0.0.0",
        "--port",
        str(VLLM_PORT),
    ]

    # enforce-eager disables both Torch compilation and CUDA graph capture
    # default is no-enforce-eager. see the --compilation-config flag for tighter control
    cmd += ["--enforce-eager" if FAST_BOOT else "--no-enforce-eager"]

    # assume multiple GPUs are for splitting up large matrix multiplications
    cmd += ["--tensor-parallel-size", str(N_GPU)]

    print(*cmd)

    subprocess.Popen(" ".join(cmd), shell=True)
