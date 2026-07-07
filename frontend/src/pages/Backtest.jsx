import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import "../styles/styles.css"

import {getBacktestById, runBacktest, getBacktestDataById} from "../api/backtests"

function Backtest() {
    const [backtest, setBacktest] = useState(null);
    const [data, setData] = useState(null);
    const [exists, setExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        async function getBT(id){
            try{
                const bt = await getBacktestById(id);
                setBacktest(bt.backtest);
                const res = await getBacktestDataById(id);
                setData(res.data);
                setExists(res.exists);
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
        const res = await getBacktestDataById(id);
        setData(res.data);
        setExists(res.exists);
        setRunning(false);
    }

    if (loading) return (<Typography variant="body1"> Loading...</Typography>)
    if (!backtest) return (<Typography variant="body1"> No backtest found</Typography>)

    return (
        <div>
            <Card sx={{p:2, m:2}} direction="row" spacing={1} alignitems="center">
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
                        <strong>Initial Capital: </strong>${Number(backtest[4]).toLocaleString()}</Typography>

                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>Start Date: </strong>{new Date(backtest[5]).toLocaleDateString()}</Typography>

                    <Typography sx={{ lineHeight: 1, display: "flex", alignItems: "center" }} variant="body1">
                        <strong>End Date: </strong>{new Date(backtest[6]).toLocaleDateString()}</Typography>

                    {!exists && (
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
                
                <Divider sx={{mt:1, borderBottomWidth: 3, borderColor: "maroon" }}/>

                <Typography sx={{mt:2}} variant="h6">Backtest Metrics</Typography>
                <Divider sx={{mt:0, width:250, borderBottomWidth: 2, borderColor: "maroon" }}/>
                {!data ? (
                    <Typography variant="body1">
                        No data yet. Run above.
                    </Typography>
                )
                : (
                    <Card sx={{mt:2, width:250}}>
                        <Stack direction="row" sx={{p:1}} spacing={1} alignitems="center">
                            <Typography>Total Return: </Typography>
                            <Typography sx={{color: data[1] >= 0 ? "green" : "red"}}>{Math.round(data[1] * 10000)/100}%</Typography>
                        </Stack>
                        <Stack direction="row" sx={{p:1}} spacing={1} alignitems="center">
                            <Typography>Annualized Return:</Typography>
                            <Typography sx={{color: data[4] >= 0 ? "green" : "red"}}>{Number(Math.round(data[4] * 10000)/100)}%</Typography>
                        </Stack>
                        <Stack direction="row" sx={{p:1}} spacing={1} alignitems="center">
                            <Typography>Profit/Loss:</Typography>
                            <Typography sx={{color: data[3] >= 0 ? "green" : "red"}}>${Number(Math.round(data[3] * 100)/100).toLocaleString()}</Typography>
                        </Stack>
                        <Typography sx={{p:1}} spacing={1}>Max Drawdown: {-1*Math.round(data[5] * 10000)/100}%</Typography>
                        <Stack direction="row" sx={{p:1}} spacing={1} alignitems="center">
                            <Typography>Win Rate:</Typography>
                            <Typography sx={{color: data[6] >= 0 ? "green" : "red"}}>{Number(Math.round(data[6] * 10000)/100)}%</Typography>
                        </Stack>
                    </Card>                
                )}

                <Divider sx={{mt:1, borderBottomWidth: 3, borderColor: "maroon" }}/>

                <Typography sx={{mt:2}} variant="h6">Trades Made</Typography>
                <Divider sx={{mt:0, width:180, borderBottomWidth: 2, borderColor: "maroon" }}/>
                {!data ? (
                    <Typography variant="body1">
                        No trades yet. Run above.
                    </Typography>
                )
                : (data[2].map((trade, i) => (
                    <Card key={i} sx={{mt:2, width:180}}>
                        <Stack direction="column" sx={{p:1}} spacing={1} alignitems="center">
                            <Typography><strong>{trade.Action}</strong></Typography>
                            <Typography variant="body1">Date: {new Date(trade.Date).toLocaleDateString()}</Typography>
                            <Typography>{trade.Action} Price: ${Math.round(trade.Price*100)/100}</Typography>
                            <Typography>Quantity: {trade.Quantity} shares</Typography>
                        </Stack>
                    </Card>                
                )))}
            </Card>
        </div>
    );
}

export default Backtest;
