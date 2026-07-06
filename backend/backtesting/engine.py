from backtesting.portfolio import Portfolio

class BacktestResult:
    def __init__(self):
        self.history = []
        self.final_value = 0
        self.total_return = 0
        self.num_trades = 0

class BacktestEngine:
    def __init__(self, strategy):
        self.strategy = strategy

    def run(self, data, initial_cash):
        portfolio = Portfolio(initial_cash)

        result = BacktestResult()

        for i, (date, row) in enumerate(data.iterrows()):
            signal = self.strategy.decide(i, row)

            price = row["Close"]

            if signal == "BUY":
                portfolio.buy(price)
                result.num_trades += 1
            elif signal == "SELL":
                portfolio.sell(price)
                result.num_trades += 1

            result.history.append({
                "Date": date,
                "Portfolio Value": portfolio.value(price),
                "Cash": portfolio.cash,
                "Shares": portfolio.shares
            })
        
        result.final_value = portfolio.value(price)
        result.total_return = (result.final_value - initial_cash)/initial_cash

        return result