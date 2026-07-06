from flask import Flask
from flask_cors import CORS

from routes.new_backtest import new_backtest_bp
from routes.get_backtests import get_backtests_bp
from routes.get_backtest import get_backtest_bp
from routes.run_backtest import run_backtest_bp
from routes.get_backtest_data import get_backtest_data_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(new_backtest_bp)
app.register_blueprint(get_backtests_bp)
app.register_blueprint(get_backtest_bp)
app.register_blueprint(run_backtest_bp)
app.register_blueprint(get_backtest_data_bp)


print(app.url_map)

@app.route("/")
def home():
    return "Backend is running!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)