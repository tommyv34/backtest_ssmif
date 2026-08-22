#include "engine.h"
#include "portfolio.h"
#include <deque>
#include <cmath>
#include <algorithm>
#include <iostream>
#include <string>

Portfolio::Portfolio(double initial_cash) : initial_cash(initial_cash), cash(initial_cash){}

int Portfolio::buy(double price, int quantity){
    int max_shares = static_cast<int>(cash/price);

    quantity = std::min(quantity, max_shares);
    double cost = quantity * price;

    cash -= cost;
    shares += quantity;

    Lot lot;
    lot.shares = quantity;
    lot.price = price;
    lots.push_back(lot);

    return quantity;
}

int Portfolio::sell(double price, int quantity){
    quantity = std::min(quantity, shares);
    int remaining = quantity;

    while(remaining > 0){
        int lot_shares = lots.front().shares;
        double buy_price = lots.front().price;

        int sold = std::min(remaining, lot_shares);
        remaining -= sold;
        double pnl = (price - buy_price) * sold;

        closed_trades ++;

        if(pnl > 0){winning_trades++;}

        cash += sold * price;
        shares -= sold;

        if (sold == lot_shares){
            lots.pop_front();
        }
        else{
            lots.front().shares -= sold;
        }
    }

    return quantity;
}

double Portfolio::value(double current_price){
    return cash + (shares * current_price);
}

double Portfolio::winRate(){
    if(closed_trades == 0){
        return 0;
    }
    else{
        return static_cast<double>(winning_trades) / closed_trades;
    }
}