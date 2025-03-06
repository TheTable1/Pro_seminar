import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoffeeBean from "./coffee_bean";
import CoffeeMenu from "./coffee_menu";
import WorldCoffee from "./worldCoffee";
import History from "./history";
import GeneCoffee from "./geneCoffee";
import Roasting from "./Roasting";
import Articles from "./articles";
import Process from "./process";
import SignUp from "./SignUp";
import Login from "./Login";
import Home from "./Home";
import Simulator from "./CoffeeSimulator";
import Extraction from "./extraction";
import Suggestion from "./suggestion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />

        <Route path="/history" element={<History />} />
        <Route path="/geneCoffee" element={<GeneCoffee />} />
        <Route path="/roasting" element={<Roasting />} />
        <Route path="/extraction" element={<Extraction />} />
        <Route path="/process" element={<Process />} />
        <Route path="/worldCoffee" element={<WorldCoffee />} />
        <Route path="/articles" element={<Articles />} />

        <Route path="/coffee_bean" element={<CoffeeBean />} />

        <Route path="/coffee_menu" element={<CoffeeMenu />} />

        <Route path="/simulator" element={<Simulator />} />
        
        <Route path="/suggestion" element={<Suggestion/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
