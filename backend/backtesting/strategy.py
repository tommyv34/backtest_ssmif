from abc import ABC, abstractmethod

class Strategy(ABC):
    @abstractmethod
    def decide(self, index, row, end):
        pass

class BuyHoldStrategy(Strategy):
    def decide(self, index, row, end):
        if index == 0:
            return ("BUY", 100)
        elif index == end - 1:
            return ("SELL", 100)
        
        return ("HOLD", 0)