class Portfolio:
    def __init__(self, initial_cash):
        self.cash = initial_cash
        self.shares = 0
    
    def buy(self, price):
        shares_to_buy = int(self.cash // price)

        if shares_to_buy == 0:
            return
        
        self.cash -= shares_to_buy * price
        self.shares += shares_to_buy
    
    def sell(self, price):
        self.cash += self.shares * price
        self.shares = 0

    def value(self, current_price):
        return self.cash + self.shares * current_price