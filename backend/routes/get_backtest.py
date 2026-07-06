from flask import jsonify, Blueprint
from config import get_connection

get_backtest_bp = Blueprint("backtest", __name__)

@get_backtest_bp.route("/backtest/<int:id>", methods=["GET"])
def get_backtest(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
                    """
                    SELECT * FROM backtests WHERE id = %s
                    """, (id,)
                )
        row = cur.fetchone()
        if row is None:
            return jsonify({
                "message": "Backtest not found",
                "backtest": None,
                "exists": False
            }), 200
    except:
        return jsonify({
            "message": "Failed to fetch",
            "backtest": None,
            "exists": False
        }), 500
    finally:
        conn.close()

    return jsonify({
        "message": "Backtest fetched",
        "backtest": row,
        "exists": True
    }), 200