import yfinance as yf
from datetime import datetime
import json

from config import get_connection
from backtesting.backtesting_cpp import Engine, BuyHoldStrategy, MarketData

def run_new_backtest(id, strategy, ticker, initialCapital, startDate, endDate):
    conn = None
    match strategy:
        case "BuyHold":
            strategy = BuyHoldStrategy()
    try:
        startDate = datetime.strptime(
            startDate,
            "%a, %d %b %Y %H:%M:%S %Z"
        )
        endDate = datetime.strptime(
            endDate,
            "%a, %d %b %Y %H:%M:%S %Z"
        )
        df = yf.download(ticker, start=startDate.strftime("%Y-%m-%d"), end=endDate.strftime("%Y-%m-%d"))
        df.columns = df.columns.droplevel(1)

        engine = Engine(strategy, startDate, endDate)

        market_data = []

        for index, row in df.iterrows():
            data = MarketData()

            data.date = index.to_pydatetime()
            data.open = float(row["Open"])
            data.high = float(row["High"])
            data.low = float(row["Low"])
            data.close = float(row["Close"])
            data.volume = float(row["Volume"])

            market_data.append(data)

        results = engine.run(market_data, initialCapital)   

        conn = get_connection()
        cur = conn.cursor()
        trades = []

        for trade in results.trades:
            trades.append({
                "action": trade.action,
                "cash": float(trade.cash),
                "date": trade.date.isoformat(),
                "portfolio_value": float(trade.portfolio_value),
                "price": float(trade.price),
                "quantity": float(trade.quantity),
                "shares": float(trade.shares)
            })
        cur.execute(
            """
            INSERT INTO backtests_data
            (id, 
            total_return, 
            history, 
            profit_loss, 
            annualized_return,
            max_drawdown,
            win_rate)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                id,
                float(results.total_return),
                json.dumps(trades),
                float(results.profit_loss),
                float(results.annualized_return),
                float(results.max_drawdown),
                float(results.win_rate)
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