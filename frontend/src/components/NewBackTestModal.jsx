import ReactModal from 'react-modal';
import { useState } from 'react';

import "../styles/styles.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';

ReactModal.setAppElement('#root');

function NewBackTestModal(props){
    const [name, setName] = useState("");
    const [strategy, setStrategy] = useState("");
    const [ticker, setTicker] = useState("");
    const [initialCapital, setInitialCapital] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    async function handleSave(){
        const backtest = {
            name,
            strategy,
            ticker,
            initialCapital,
            startDate,
            endDate
        };

        try{
            const response = await fetch("http://localhost:5000/new-backtest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(backtest),
            });

            if(!response.ok) throw new Error("Failed to create backtest");
            const data = await response.json();
            console.log(data);

            setName("");
            setStrategy("");
            setTicker("");
            setInitialCapital("");
            setStartDate("");
            setEndDate("");
            props.onClose();
            props.onSuccess();
        }
        catch(err){
            alert(err.message)
        }
    }

    function handleClose(){
        setName("");
        setStrategy("");
        setTicker("");
        setInitialCapital("");
        setStartDate("");
        setEndDate("");
        props.onClose();
    }

    return(
        <ReactModal
        isOpen={props.isOpen}
        contentLabel='New Backtest'
        className={"modal"}
        overlayClassName={"overlay"}
        >
            <div>
                <TextField
                id="backtest_name"
                label="Backtest Name"
                variant="outlined"
                className='modal_text_input'
                value={name}
                onChange={(e) => setName(e.target.value)}
                ></TextField>

                <FormControl>
                    <Select
                    id="strategy"
                    label="Strategy"
                    className='modal_select'
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    >
                        <MenuItem></MenuItem>
                    </Select>
                </FormControl>

                    <TextField
                    id="ticker"
                    label="Ticker"
                    className='modal_text_input'
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    >
                    </TextField>

                <div>
                    <TextField
                    id="start_date"
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    className='modal_text_input'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    ></TextField>

                    <TextField
                    id="end_date"
                    label="End Date"
                    type="date"
                    variant="outlined"
                    className='modal_text_input'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    ></TextField>
                </div>

                <TextField
                id="initial_capital"
                label="Initial Capital"
                type="number"
                variant="outlined"
                className='modal_text_input'
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                ></TextField>

                <div>
                    <Button 
                    onClick={handleClose}
                    className='button'
                    >
                        Close
                    </Button>

                    <Button 
                    onClick={handleSave}
                    className='button'
                    >
                        Save
                    </Button>
                </div>  
            </div>
        </ReactModal>
    )
}

export default NewBackTestModal;