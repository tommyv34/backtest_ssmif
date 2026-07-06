import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import "../styles/styles.css"

import {getBacktestById, runBacktest, getBacktestDataById} from "../api/backtests"

function Backtest() {
    const [backtest, setBacktest] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        async function getBT(id){
            try{
                const bt = await getBacktestById(id);
                setBacktest(bt.backtest);
                const data = await getBacktestDataById(id);
                setData(data);
            }
            catch(err){
                console.error(err);
            }
            finally{
                setLoading(false);
            }   
        }
        getBT(id);
    }, []);

    async function handleRun(id){
        setRunning(true);
        await runBacktest(id, backtest[2], backtest[3], backtest[4], backtest[5], backtest[6]);
        const data = await getBacktestDataById(id);
        setData(data);
        setRunning(false);
    }

    if (loading) return (<Typography variant="body1"> Loading...</Typography>)
    if (!backtest) return (<Typography variant="body1"> No backtest found</Typography>)
    
    return (
        <div>
            <Stack direction="row" spacing={1} alignitems="center">
                <Stack
                    direction="row"
                    spacing={1}
                    alignitems="center"
                >
                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>Name: </strong>{backtest[1]}</Typography>

                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>Strategy: </strong>{backtest[2]}</Typography>

                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>Ticker: </strong>{backtest[3]}</Typography>

                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>Initial Capital: </strong>{backtest[4]}</Typography>

                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>Start Date: </strong>{new Date(backtest[5]).toLocaleDateString()}</Typography>

                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>End Date: </strong>{new Date(backtest[6]).toLocaleDateString()}</Typography>

                    {data && !data.exists && (
                        <IconButton
                        sx={{
                            color: "gray",
                            ml: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                color: "maroon",
                                transform: "scale(1.15)"
                            },
                            "&:active": {
                                transform: "scale(0.9)"
                            }
                        }}
                        onClick={() => handleRun(id)}
                    >
                        {running ? (<Typography>Running</Typography>) : (<Typography>Run Backtest</Typography>)}
                    </IconButton>
                    )}                    
                </Stack>
            </Stack>
        </div>
    );
}

export default Backtest;
