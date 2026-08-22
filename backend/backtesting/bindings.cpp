#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <pybind11/chrono.h>

#include "engine.h"
#include "portfolio.h"
#include "strategy.h"

namespace py = pybind11;

PYBIND11_MODULE(backtesting_cpp, m){
    py::class_<MarketData>(m, "MarketData")
    .def(py::init<>())
    .def_readwrite("date", &MarketData::date)
    .def_readwrite("open", &MarketData::open)
    .def_readwrite("close", &MarketData::close)
    .def_readwrite("high", &MarketData::high)
    .def_readwrite("low", &MarketData::low)
    .def_readwrite("volume", &MarketData::volume);

    py::class_<Decision>(m, "Decision")
    .def(py::init<>())
    .def_readwrite("signal", &Decision::signal)
    .def_readwrite("qty", &Decision::qty);

     py::class_<History>(m, "History")
        .def_readonly("date", &History::date)
        .def_readonly("portfolio_value", &History::portfolio_value)
        .def_readonly("cash", &History::cash)
        .def_readonly("shares", &History::shares);

    py::class_<Trades>(m, "Trades")
        .def_readonly("date", &Trades::date)
        .def_readonly("portfolio_value", &Trades::portfolio_value)
        .def_readonly("cash", &Trades::cash)
        .def_readonly("shares", &Trades::shares)
        .def_readonly("action", &Trades::action)
        .def_readonly("price", &Trades::price)
        .def_readonly("quantity", &Trades::quantity);

    py::class_<Result>(m, "Result")
        .def_readonly("history", &Result::history)
        .def_readonly("trades", &Result::trades)
        .def_readonly("final_value", &Result::final_value)
        .def_readonly("profit_loss", &Result::profit_loss)
        .def_readonly("total_return", &Result::total_return)
        .def_readonly("num_trades", &Result::num_trades)
        .def_readonly("annualized_return", &Result::annualized_return)
        .def_readonly("max_drawdown", &Result::max_drawdown)
        .def_readonly("win_rate", &Result::win_rate);

    py::class_<Strategy>(m, "Strategy");

    py::class_<BuyHoldStrategy, Strategy>(m, "BuyHoldStrategy")
        .def(py::init<>());

    py::class_<Engine>(m, "Engine")
        .def(
            py::init<
                Strategy&,
                std::chrono::system_clock::time_point,
                std::chrono::system_clock::time_point
            >(),
            py::keep_alive<1, 2>()
        )
        .def(
            "run",
            &Engine::run,
            py::arg("data"),
            py::arg("initial_cash")
        );
}