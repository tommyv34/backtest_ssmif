import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Backtest from "./pages/Backtest.jsx";


function App() {
  return (
    <BrowserRouter>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/backtest/:id" element={<Backtest/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
