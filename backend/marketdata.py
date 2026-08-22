import pandas_market_calendars as mcal

from config import get_connection

class MarketData:
    def __init__(self):
        self.cal = mcal.get_calendar("NYSE")
    
    def has_all_dates(self, symbol, start_date, end_date):
        schedule = self.cal.schedule(
            start_date=start_date, end_date=end_date
        )
        dates_needed = set(schedule.index.date)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
                SELECT date
                FROM symbol_data
                WHERE symbol = %s
                AND date BETWEEN %s AND %s
            """, (symbol, start_date, end_date))
        
        dates_fetched = {row[0] for row in cur.fetchall()}
        cur.close()

        missing = dates_needed - dates_fetched

        if missing:
            return False
        else:
            return True