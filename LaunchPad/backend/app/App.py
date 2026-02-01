from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import google.generativeai as genai
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Path to your frontend
frontend_path = r'D:\Hacakthon\EcoCart\frontend\pages'

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Retrieve API Key from environment variables
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    raise ValueError("API key not found. Please set GOOGLE_API_KEY in your .env file")

# Configure Google Generative AI
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/')
def home():
    return send_from_directory(frontend_path, 'chatbot.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get('question', '')
    try:
        # Generate response from the model
        response = model.generate_content(question)
        cleaned_response = clean_response(response.text.strip())
        return jsonify({'answer': cleaned_response})
    except Exception as e:
        # Handle errors more gracefully
        return jsonify({'answer': f"❌ Request error: {str(e)}"})

def clean_response(text):
    """
    Function to clean and structure the response
    """
    # Remove markdown headers like ## or #
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)

    # Add a new line before key sections
    text = re.sub(r'(?<!^)\s*(At Home:|Transportation:|Shopping & Consumption:|Other:)', r'\n\n\1', text)

    # Replace bullet points * or - with newline and dash
    text = re.sub(r'^\s*[\*\-]\s+', r'\n- ', text, flags=re.MULTILINE)

    # Remove asterisks used for emphasis
    text = re.sub(r'\*+', '', text)

    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)

    # Normalize spacing
    text = re.sub(r'\n{2,}', '\n\n', text)  # double line breaks between sections
    text = re.sub(r'[ \t]+', ' ', text)

    return text.strip()

# Flask server runs in debug mode if not deployed
if __name__ == '__main__':
    app.run(debug=True)
