import yfinance as yf

from config import get_connection

def ingest(symbol, start_date, end_date):
    conn = get_connection()
    cur = conn.cursor()

    df = yf.download(symbol, start = start_date, end = end_date)
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
                float(row["Volume"])
            )
        )
        
    conn.commit()
    cur.close()    
    conn.close()

# ingest("AAPL", "2024-01-01", "2024-01-10")