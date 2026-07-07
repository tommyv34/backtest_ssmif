import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import IconButton from "@mui/material/IconButton";
import "../styles/styles.css"

import NewBackTestModal from "../components/NewBackTestModal";
import { getBacktests } from "../api/backtests";

function Home() {
    const [newBT, setNewBT] = useState(false);
    const [backtests, setBacktests] = useState([]);
    const [loadingBacktests, setLoadingBacktests] = useState(true);
    const [backtest, setBacktest] = useState([]);

    const navigate = useNavigate();

    function handleNewBT(){
        if(newBT) setNewBT(false);
        else setNewBT(true);
    }

    useEffect(() => {
        loadBacktests();        
    }, []);

    async function loadBacktests(){
        try{
            const data = await getBacktests();
            setBacktests(data.backtests);
        }
        catch(err){
            console.error(err);
        }
        finally{
            setLoadingBacktests(false);
        }
    }

    return (
        <div>
            <Button 
                onClick={handleNewBT}
                className="button"
            >
                Run New Backtest
            </Button>
            <NewBackTestModal
                isOpen={newBT}
                onClose={() => setNewBT(false)}
                onSuccess={() => {setNewBT(false); loadBacktests();}}
            />

            <Typography sx={{p:1}} variant="h5">Backtests</Typography>
            {loadingBacktests ? (
                <Typography variant="body1">
                    Loading backtests...
                </Typography>
            )
            : backtests.length == 0 ? (
                <Typography variant="body1">
                    No backtests created yet. Consider adding one above.
                </Typography>
            )
            : backtests.map((backtest) => (
                <Card key={backtest[0]} sx={{m:2}}>
                    <CardContent>
                        <Stack direction="row" spacing={1} alignitems="center">
                            <Stack
                                direction="row"
                                divider={<Divider orientation="vertical" flexItem 
                                    sx={{ borderRightWidth: 2, borderColor: "maroon" }}/>}
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
                            </Stack>
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
                                onClick={() => navigate(`/backtest/${backtest[0]}`)}
                            >
                                <PlayCircleIcon fontSize="medium" />
                            </IconButton>   
                        </Stack>
                    </CardContent>
                </Card>                
            ), 
            backtests.length > 1 ?? (<Divider/>))
            }
        </div>
    );
}

export default Home;
