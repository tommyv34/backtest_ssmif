from abc import ABC, abstractmethod

class Strategy(ABC):
    @abstractmethod
    def decide(self, index, row):
        pass

class BuyHoldStrategy(Strategy):
    def decide(self, index, row):
        if index == 0:
            return "BUY"
        return "HOLD"