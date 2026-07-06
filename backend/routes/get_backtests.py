from flask import jsonify, Blueprint
from config import get_connection

get_backtests_bp = Blueprint("get-backtests", __name__)

@get_backtests_bp.route("/get-backtests", methods=["GET"])
def get_backtests():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
                    """
                    SELECT * FROM backtests
                    """
                )
        rows = cur.fetchall()
    finally:
        conn.close()

    return jsonify({
        "message": "Backtests fetched",
        "backtests" : rows
    }), 200