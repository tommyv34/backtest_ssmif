#include "strategy.h"

Decision BuyHoldStrategy::decide(int index, const MarketData& row, int data_size){
    if(index == 0){
        Decision decision;
        decision.signal = "BUY";
        decision.qty = 100;
        return decision;
    }
        
    else if(index == data_size - 1){
        Decision decision;
        decision.signal = "SELL";
        decision.qty = 100;
        return decision;
    }

    Decision decision;
    decision.signal = "HOLD";
    decision.qty = 0;
    return decision;
};

// Decision ConstantPriceTreshold::decide(int index, const MarketData& row, int data_size, double threshold){
//     Decision decision;
//     if(row.high >= threshold){
//         decision.signal = "BUY";
//         decision.qty = 100;
//     }
//     else if
//     if(index == 0){
//         Decision decision;
//         decision.signal = "BUY";
//         decision.qty = 100;
//         return decision;
//     }
        
//     else if(index == data_size - 1){
//         Decision decision;
//         decision.signal = "SELL";
//         decision.qty = 100;
//         return decision;
//     }

//     Decision decision;
//     decision.signal = "HOLD";
//     decision.qty = 0;
//     return decision;
// }