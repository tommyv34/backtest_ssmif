export async function getBacktests(){
    try{
        const response = await fetch("http://localhost:5000/get-backtests");
        
        if(!response.ok) throw new Error ("Failed to load backtests");

        const data = await response.json();
        return data;
    }
    catch(err){
        console.error(err);
    }
}

export async function getBacktestById(id){
    try{
        const response = await fetch(`http://localhost:5000/backtest/${id}`);
        
        if(!response.ok) throw new Error ("Failed to load backtest");

        const data = await response.json();
        return data;
    }
    catch(err){
        console.error(err);
    }
}

export async function getBacktestDataById(id){
    try{
        const response = await fetch(`http://localhost:5000/get-backtest/${id}`);
        
        if(!response.ok) throw new Error ("Failed to load backtest data");

        const data = await response.json();
        return data;
    }
    catch(err){
        console.error(err);
    }
}

export async function runBacktest(id, strategy, ticker, initialCapital, startDate, endDate){
    const backtest = {
        id, 
        strategy, 
        ticker, 
        initialCapital, 
        startDate, 
        endDate
    }
    try{
        const response = await fetch(`http://localhost:5000/run-backtest/${id}`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(backtest),
            });
        
        if(!response.ok) throw new Error ("Failed to run backtest");

        const data = await response.json();
        return data;
    }
    catch(err){
        console.error(err);
    }
}