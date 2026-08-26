import yfinance as yf
from datetime import datetime

from config import get_connection

def ingest(symbol, start_date, end_date):
    if isinstance(start_date, str):
        start_date = datetime.strptime(
            start_date,
            "%a, %d %b %Y %H:%M:%S %Z"
        ).strftime("%Y-%m-%d")

    if isinstance(end_date, str):
        end_date = datetime.strptime(
            end_date,
            "%a, %d %b %Y %H:%M:%S %Z"
        ).strftime("%Y-%m-%d")

    conn = get_connection()

    try:
        cur = conn.cursor()

        df = yf.download(symbol, start = start_date, end = end_date, auto_adjust = False)
        df.columns = df.columns.droplevel(1)
        for index, row in df.iterrows():
            cur.execute(
                """
                INSERT INTO symbol_data
                (symbol, date, open, high, low, close, volume)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT(symbol, date)
                DO NOTHING
                """,
                (
                    symbol,
                    index.date(),
                    float(row["Open"]),
                    float(row["High"]),
                    float(row["Low"]),
                    float(row["Close"]),
                    int(row["Volume"])
                )
            )
            
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()    
        conn.close()