# Avenger 🛡️ – Ramazone 2.0 AI Shopping Assistant

A lightweight FastAPI chatbot that simulates Amazon's Rufus AI for the Ramazone 2.0 e-commerce platform.

## Run locally
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

API available at: http://localhost:8001
Interactive docs: http://localhost:8001/docs

## Deploy to Render
1. Push this folder to a GitHub repo
2. New Web Service → Python → Build: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## API
`POST /chat`
```json
{ "message": "I need a phone under 20000" }
```
Response:
```json
{
  "reply": "...",
  "suggestions": ["...", "..."]
}
```
