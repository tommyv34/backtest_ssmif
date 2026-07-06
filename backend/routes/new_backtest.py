from flask import request, jsonify, Blueprint
from config import get_connection

new_backtest_bp = Blueprint("new-backtest", __name__)

@new_backtest_bp.route("/new-backtest", methods=["POST"])
def new_backtest():
    data = request.get_json()

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
                    """
                    INSERT INTO backtests
                    (name, strategy, ticker, initial_capital, start_date, end_date)
                    VALUES (%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        data["name"],
                        data["strategy"],
                        data["ticker"],
                        data["initialCapital"],
                        data["startDate"],
                        data["endDate"]
                    )
                )
        conn.commit()
    finally:
        conn.close()

    return jsonify({
        "message": "Backtest received",
        "data": data
    }), 201