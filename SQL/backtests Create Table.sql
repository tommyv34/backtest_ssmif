CREATE TABLE backtests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    strategy VARCHAR(50) NOT NULL,
    ticker VARCHAR(10) NOT NULL,
    initial_capital DOUBLE PRECISION NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);