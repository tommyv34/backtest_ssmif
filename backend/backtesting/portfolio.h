#pragma once

#include <deque>

struct Lot{
    int shares;
    double price;
};

class Portfolio{
    double initial_cash;
    int closed_trades = 0;
    int winning_trades = 0;
    std::deque<Lot> lots;

    public:
        Portfolio(double initial_cash);
        double cash;
        int shares = 0;
        int buy(double price, int quantity);
        int sell(double price, int quantity);
        double value (double current_price);
        double winRate();
};