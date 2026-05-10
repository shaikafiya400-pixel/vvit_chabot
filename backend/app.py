from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
images_dir = os.path.join(os.path.dirname(__file__), "..", "images")
app = Flask(__name__, static_folder=frontend_dir, static_url_path="")
CORS(app)

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(images_dir, filename)

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/chat", methods=["POST"])
def chat():

    data = request.json

    message = data.get("message", "")
    role = data.get("role", "")

    # Create AI prompt
    system_prompt = f"""
    You are VVIT College AI Assistant.

    Answer only VVIT college related questions.

    User Role: {role}

    Give short, clear and helpful answers.
    """

    # Send to Groq AI
    completion = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },

            {
                "role": "user",
                "content": message
            }
        ],

        temperature=0.7,
        max_tokens=500
    )

    # Get AI reply
    reply = completion.choices[0].message.content

    return jsonify({
        "reply": reply
    })


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)