import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar.jsx"
import Trades from "./pages/Trades.jsx"
import Metrics from "./pages/Metrics.jsx"
import Home from "./pages/Home.jsx";


function App() {
  return (
    <BrowserRouter>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/trades" element={<Trades/>}/>
        <Route path="/metrics" element={<Metrics/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
