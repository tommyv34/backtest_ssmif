#pragma once

#include <iostream> 
#include <chrono>
#include <vector>
#include <string>

struct History{
    std::chrono::system_clock::time_point date;
    double portfolio_value;
    double cash;
    int shares;
};

struct Trades{
    std::chrono::system_clock::time_point date;
    double portfolio_value;
    double cash;
    int shares;
    std::string action;
    double price;
    int quantity;
};

struct Result{
    std::vector<History> history;
    std::vector<Trades> trades;
    double final_value = 0;
    double profit_loss = 0;
    double total_return = 0;
    int num_trades = 0;
    double annualized_return = 0;
    double max_drawdown = 0;
    double win_rate = 0;
};

struct MarketData{
    std::chrono::system_clock::time_point date;
    double open;
    double close;
    double high;
    double low;
    double volume;
};

struct Decision{
    std::string signal;
    int qty;
};

struct Strategy{
    virtual Decision decide(int index, const MarketData& row, int data_size) = 0;
    virtual ~Strategy() = default;
};

struct Engine{
    Strategy &strategy;
    std::chrono::system_clock::time_point startDate;
    std::chrono::system_clock::time_point endDate;

    Engine(Strategy &strategy, 
        std::chrono::system_clock::time_point sD,
        std::chrono::system_clock::time_point eD)
        : strategy(strategy), startDate(sD), endDate(eD) {}

    Result run(const std::vector<MarketData>& data, double initial_cash);
};