from datetime import datetime
from collections import deque

from backtesting.portfolio import Portfolio

class BacktestResult:
    def __init__(self):
        self.history = []
        self.trades = []
        self.final_value = 0
        self.profit_loss = 0
        self.total_return = 0
        self.num_trades = 0
        self.annualized_return = 0
        self.max_drawdown = 0
        self.win_rate = 0

class BacktestEngine:
    def __init__(self, strategy, startDate, endDate):
        self.strategy = strategy
        self.startDate = self._to_datetime(startDate)
        self.endDate = self._to_datetime(endDate)

    def _to_datetime(self, d):
        if isinstance(d, datetime):
            return d

        return datetime.strptime(d, "%Y-%m-%d")
    
    def run(self, data, initial_cash):
        portfolio = Portfolio(initial_cash)

        result = BacktestResult()

        peak = None
        max_drawdown = None
        drawdown = None

        for i, (date, row) in enumerate(data.iterrows()):
            signal, qty = self.strategy.decide(i, row, len(data))

            price = row["Close"]

            if signal == "BUY":
                bought = portfolio.buy(price, qty)
                if bought > 0:
                    result.num_trades += 1
                    result.trades.append({
                        "Date": str(date),
                        "Portfolio Value": portfolio.value(price),
                        "Cash": portfolio.cash,
                        "Shares": portfolio.shares,
                        "Action": "Buy",
                        "Price": float(price),
                        "Quantity": int(bought)
                    })
            elif signal == "SELL":
                sold = portfolio.sell(price, qty)
                if sold > 0:
                    result.num_trades += 1
                    result.trades.append({
                        "Date": str(date),
                        "Portfolio Value": portfolio.value(price),
                        "Cash": portfolio.cash,
                        "Shares": portfolio.shares,
                        "Action": "Sell",
                        "Price": float(price),
                        "Quantity": int(sold)
                    })

            result.history.append({
                "Date": str(date),
                "Portfolio Value": portfolio.value(price),
                "Cash": portfolio.cash,
                "Shares": portfolio.shares
            })

            if peak == None or portfolio.value(price) > peak:
                peak = portfolio.value(price)

            if peak > 0:
                drawdown = (peak - portfolio.value(price))/peak
            else:
                drawdown = 0

            if max_drawdown == None or drawdown > max_drawdown:
                max_drawdown = drawdown
        
        years = (self.endDate - self.startDate).days / 365.25

        result.final_value = portfolio.value(price)
        result.profit_loss = result.final_value - initial_cash
        result.total_return = result.profit_loss/initial_cash
        result.annualized_return = ((result.final_value/initial_cash) ** (1/years)) - 1
        result.max_drawdown = max_drawdown
        result.win_rate = portfolio.win_rate()

        return result