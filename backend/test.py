import yfinance as yf

from backtesting.engine import BacktestEngine
from backtesting.strategy import BuyHoldStrategy

df = yf.download("AAPL", start="2024-01-01", end="2024-12-31")

df.columns = df.columns.droplevel(1)

engine = BacktestEngine(BuyHoldStrategy())

history = engine.run(df, 10000)

print(history[-1])