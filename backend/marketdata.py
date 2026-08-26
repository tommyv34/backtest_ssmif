import pandas_market_calendars as mcal

from config import get_connection
from ingest import ingest

class MarketData:
    def __init__(self):
        self.cal = mcal.get_calendar("NYSE")
    
    def has_all_dates(self, symbol, start_date, end_date):
        schedule = self.cal.schedule(
            start_date=start_date, end_date=end_date
        )
        dates_needed = list(schedule.index.date)

        conn = get_connection()

        try:
            cur = conn.cursor()

            cur.execute(
                """
                    SELECT date
                    FROM symbol_data
                    WHERE symbol = %s
                    AND date BETWEEN %s AND %s
                """, (symbol, start_date, end_date))
            
            dates_fetched = {row[0] for row in cur.fetchall()}

            missing = set(dates_needed) - dates_fetched
            
            if missing:
                return (False, dates_fetched, dates_needed)
            else:
                return (True, dates_fetched, dates_needed)

        finally:
            cur.close()
            conn.close()

    def ensure_data(self, symbol, start_date, end_date):
        (has_all, fetched, trading_dates) = self.has_all_dates(symbol, start_date, end_date)

        if has_all:
            return

        start_missing = None

        for date in trading_dates:
            if date not in fetched:
                if start_missing is None:
                    start_missing = date
                
            elif start_missing is not None:
                ingest(symbol, start_missing, date)
                start_missing = None

        if start_missing is not None:
            ingest(symbol, start_missing, end_date)