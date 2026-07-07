from collections import deque

class Portfolio:
    def __init__(self, initial_cash):
        self.cash = initial_cash
        self.shares = 0
        self.lots = deque()
        self.closed_trades = 0
        self.winning_trades = 0
    
    def buy(self, price, shares):
        max_shares = int(self.cash // price)

        shares = min(shares, max_shares)
        cost = shares * price
        
        self.cash -= cost
        self.shares += shares
        self.lots.append([shares, price])

        return shares
    
    def sell(self, price, shares):
        shares = min(shares, self.shares)
        
        self.cash += shares * price
        self.shares -= shares

        while shares > 0:
            lot_shares, buy_price = self.lots[0]
            sold = min(shares, lot_shares)
            pnl = (price - buy_price) * sold

            self.closed_trades += 1
            if pnl > 0:
                self.winning_trades += 1

            self.cash += sold * price
            self.shares -= sold
            shares -= sold

            if sold == lot_shares:
                self.lots.popleft()
            else:
                self.lots[0][0] -= sold

        return shares

    def value(self, current_price):
        return self.cash + self.shares * current_price
    
    def win_rate(self):
        if self.closed_trades == 0:
            return 0
        else:
            return self.winning_trades / self.closed_trades