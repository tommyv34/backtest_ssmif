from flask import Flask
from flask_cors import CORS

from backend.routes.new_backtest import new_backtest_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(new_backtest_bp)

@app.route("/")
def home():
    return "Backend is running!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)