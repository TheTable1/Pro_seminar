import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import Home from './Home';
import CoffeeBeans from './coffee_beans';
import Navbar from './navbar'; 
import WorldCoffee from './worldCoffee';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route path="/navbar" element={<Navbar />} />

        <Route path="/coffee_beans" element={<CoffeeBeans />} />

        <Route path="/worldCoffee" element={<WorldCoffee />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
