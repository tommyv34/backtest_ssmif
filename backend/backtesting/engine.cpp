#include <iostream> 
#include <chrono>
#include <vector>
#include <string>
#include <cmath>
#include "engine.h"
#include "portfolio.h"

Result Engine::run(const std::vector<MarketData>& data, double initial_cash){
        Portfolio portfolio(initial_cash);
        Result result = Result();

        double peak = 0;
        double max_drawdown = 0;
        double drawdown = 0;
        double price = 0;

        for(int i = 0; i < data.size(); i++){
            const MarketData& row = data[i];
            Decision dec = strategy.decide(i, row, data.size());
            price = row.close;

            if(dec.signal == "BUY"){
                int bought = portfolio.buy(price, dec.qty);
                if(bought > 0){
                    Trades trade = {
                        row.date,
                        portfolio.value(price),
                        portfolio.cash,
                        portfolio.shares,
                        "Buy",
                        double(price),
                        int(bought)
                    };
                    result.trades.push_back(trade);
                    result.num_trades ++;
                }
            }
            else if(dec.signal == "SELL"){
                int sold = portfolio.sell(price, dec.qty);

                if(sold > 0){
                    Trades trade = {
                        row.date,
                        portfolio.value(price),
                        portfolio.cash,
                        portfolio.shares,
                        "Sell",
                        double(price),
                        int(sold)
                    };
                    result.trades.push_back(trade);
                    result.num_trades++;
                }
            }

            History hist = {
                row.date,
                portfolio.value(price),
                portfolio.cash,
                portfolio.shares,
            };
            result.history.push_back(hist);

            if(portfolio.value(price) > peak){
                peak = portfolio.value(price);
            }

            if(peak > 0){
                drawdown = (peak - portfolio.value(price))/peak;
            }
            else{
                drawdown = 0;
            }

            if(drawdown > max_drawdown){
                max_drawdown = drawdown;
            }
        }
        double years = std::chrono::duration<double>(endDate - startDate).count() / (365.25 * 24 * 60 * 60);
        
        result.final_value = portfolio.value(price);
        result.profit_loss = result.final_value - initial_cash;
        result.total_return = result.profit_loss/initial_cash;
        result.annualized_return = std::pow(result.final_value / initial_cash, 1.0 / years) - 1;
        result.max_drawdown = max_drawdown;
        result.win_rate = portfolio.winRate();

        return result;
}