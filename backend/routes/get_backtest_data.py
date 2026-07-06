from flask import jsonify, Blueprint
from config import get_connection

get_backtest_data_bp = Blueprint("get-backtest", __name__)

@get_backtest_data_bp.route("/get-backtest/<int:id>", methods=["GET"])
def get_backtest_data(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
                    """
                    SELECT * FROM backtests_data WHERE id = %s
                    """
                , (id,))
        row = cur.fetchone()
        if row is None:
            return jsonify({
                "message": "Could not find backtest",
                "data" : None,
                "exists": False
            }), 200
    except:
        return jsonify({
            "message": "Failed to fetch",
            "data" : None,
            "exists": False
        }), 500  
    finally:
        cur.close()
        conn.close()

    return jsonify({
        "message": "Backtests fetched",
        "data" : row,
        "exists": True
    }), 200