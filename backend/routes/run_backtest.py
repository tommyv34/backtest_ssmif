from flask import jsonify, Blueprint, request
from config import get_connection
from services.backtester import run_new_backtest
from marketdata import MarketData
from ingest import ingest

run_backtest_bp = Blueprint("run-backtest", __name__)

@run_backtest_bp.route("/run-backtest/<int:id>", methods=["POST"])
def run_backtest(id):   
    market_data = MarketData() 
    conn = None
    try:
        body = request.get_json()
        strategy = body.get("strategy")
        ticker = body.get("ticker")
        initialCapital = body.get("initialCapital")
        startDate = body.get("startDate")
        endDate = body.get("endDate")

        market_data.ensure_data(ticker, startDate, endDate)
            
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
                strategy,
                ticker,
                initialCapital,
                startDate,
                endDate
            )
    finally:
        if conn:
            conn.close()

    return jsonify({
        "message": "Backtest ran",
        "backtest" : data.total_return, 
        "exists": exists
    }), 201