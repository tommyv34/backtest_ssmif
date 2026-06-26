import { Link } from "react-router-dom"
import { useState } from "react";

import Button from "@mui/material/Button"

import NewBackTestModal from "../components/NewBackTestModal";
import "../styles/styles.css"

function Home() {
    const [newBT, setNewBT] = useState(false);

    function handleNewBT(){
        if(newBT) setNewBT(false);
        else setNewBT(true);
    }
    return (
        <div>
            <h1>Home</h1>
            <Button 
                onClick={handleNewBT}
                className="button"
            >
                Run New Backtest
            </Button>
            {newBT && <NewBackTestModal/>}
        </div>
    );
}

export default Home;
