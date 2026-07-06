import yfinance as yf
from datetime import datetime


from config import get_connection
from backtesting.engine import BacktestEngine
from backtesting.strategy import BuyHoldStrategy

def run_new_backtest(id, strategy, ticker, initialCapital, startDate, endDate):
    conn = None
    match strategy:
        case "BuyHold":
            strategy = BuyHoldStrategy()
    try:
        startDate = datetime.strptime(
            startDate,
            "%a, %d %b %Y %H:%M:%S %Z"
        ).strftime("%Y-%m-%d")
        endDate = datetime.strptime(
            endDate,
            "%a, %d %b %Y %H:%M:%S %Z"
        ).strftime("%Y-%m-%d")
        df = yf.download(ticker, start=startDate, end=endDate)
        df.columns = df.columns.droplevel(1)
        engine = BacktestEngine(strategy)
        results = engine.run(df, initialCapital)
        
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO backtests_data
            (id, total_return)
            VALUES (%s, %s)
            """,
            (
                id,
                float(results.total_return),
            )
        )
        conn.commit()
    except Exception as e:
        print(e)
        raise
    finally:
        if conn:
            conn.close()

    return results