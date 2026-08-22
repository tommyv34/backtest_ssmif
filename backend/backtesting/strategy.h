#pragma once

#include "engine.h"

class BuyHoldStrategy : public Strategy {
    public:
        Decision decide(int index, const MarketData& row, int data_size) override;
};
    