## Server

Python FastAPI backend for the low-code platform.

### Setup

```bash
cd apps/server
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

### Development

```bash
uvicorn app.main:app --reload --port 8000
```

