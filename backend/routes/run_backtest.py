from flask import jsonify, Blueprint, request
from config import get_connection
from services.backtester import run_new_backtest

run_backtest_bp = Blueprint("run-backtest", __name__)

@run_backtest_bp.route("/run-backtest/<int:id>", methods=["POST"])
def run_backtest(id):
    conn = None
    try:
        body = request.get_json()
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
                    """
                    SELECT 1 FROM backtests_data WHERE id = %s LIMIT 1
                    """, (id,)
                )
        exists = cur.fetchone() is not None

        if exists:
            cur.execute(
                """
                SELECT * FROM backtests_data WHERE id = %s
                """, (id,)
            )
            data = cur.fetchone()
        else:
            data = run_new_backtest(
                id,
                body.get("strategy"),
                body.get("ticker"),
                body.get("initialCapital"),
                body.get("startDate"),
                body.get("endDate")
            )
    finally:
        if conn:
            conn.close()

    return jsonify({
        "message": "Backtest ran",
        "backtest" : data.total_return, 
        "exists": exists
    }), 201