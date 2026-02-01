from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import re
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path
import logging
from waitress import serve  # Import serve from waitress

# 📍 Load environment variables from .env file
load_dotenv(dotenv_path=Path(__file__).resolve().parent / '.env')

# ✅ Correct way to access environment variable
api_key = os.getenv("GOOGLE_API_KEY")

# ✅ Optional: print to confirm it’s loaded correctly (remove after testing)
if api_key:
    print("Loaded API Key:", api_key)
else:
    print("API Key not found!")

# Configure Gemini model
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Set up Flask
frontend_path = r'D:\Hacakthon\EcoCart\frontend\pages'
app = Flask(__name__)
CORS(app)

# Enable logging for better error handling and debugging
logging.basicConfig(level=logging.INFO)

@app.route('/')
def home():
    try:
        return send_from_directory(frontend_path, 'chatbot.html')
    except Exception as e:
        app.logger.error(f"Error loading homepage: {str(e)}")
        return jsonify({"error": "Failed to load homepage"}), 500

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    
    # Ensure 'question' is present in the request
    if not data or 'question' not in data:
        return jsonify({'error': "❌ Missing 'question' parameter"}), 400

    question = data['question']
    
    # Ensure the question is not empty
    if not question.strip():
        return jsonify({'error': "❌ Question cannot be empty"}), 400

    try:
        response = model.generate_content(question)
        cleaned_response = clean_response(response.text.strip())
        return jsonify({'answer': cleaned_response})
    
    except Exception as e:
        app.logger.error(f"Error generating response: {str(e)}")
        return jsonify({'error': f"❌ Request error: {str(e)}"}), 500

def clean_response(text):
    # Cleaning response to format it better
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'(?<!^)\s*(At Home:|Transportation:|Shopping & Consumption:|Other:)', r'\n\n\1', text)
    text = re.sub(r'^\s*[\*\-]\s+', r'\n- ', text, flags=re.MULTILINE)
    text = re.sub(r'\*+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\n{2,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

if __name__ == '__main__':
    # Use Waitress to serve the app in production
    serve(app, host='0.0.0.0', port=5000)  # Replace app.run() with serve()
