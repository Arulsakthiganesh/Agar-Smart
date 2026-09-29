import sys, os

# Add backend and root directory to python path for Vercel Serverless Function
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

# Vercel entrypoint
handler = app
