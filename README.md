# Khoury Cybersecurity Resource Guide
> By Felicity Keyzer-Pollard and Amanda Rodriques

## Setup

Open your backend and frontend in two separate terminals.

### Backend
```bash
cd src/backend
python -m venv venv
source venv/bin/activate        # windows = venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Runs on http://localhost:8000

### Frontend
```bash
cd src/frontend
npm install
npm run dev
```
Runs on http://localhost:5173
