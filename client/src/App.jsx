import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoffeeBeans from "./coffee_beans";
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

        <Route path="/coffee_beans" element={<CoffeeBeans />} />

        <Route path="/simulator" element={<Simulator />} />

      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
