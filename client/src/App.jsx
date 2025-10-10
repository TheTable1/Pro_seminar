import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoffeeBean from "./coffee_bean";
import CoffeeMenu from "./coffee_menu";
import WorldCoffee from "./worldCoffee";
import History from "./history";
import GeneCoffee from "./geneCoffee";
import Roasting from "./Roasting";
import Articles from "./articles";
import Profile from "./profile";
import Process from "./process";
import SignUp from "./SignUp";
import Login from "./Login";
import Home from "./Home";
import Simulator from "./CoffeeSimulator";
import Extraction from "./extraction";
import Suggestion from "./suggestion";
import Quiz from "./quiz";
import QuizDetail from "./quizDetail";
import Select from "./simulator/sim-es-moka";
import Customcoffee from "./simulator/customcoffee";
import { Helmet } from "react-helmet";

function App() {
  return (
    <BrowserRouter>
      {/* Move Helmet outside of Routes */}
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2DhKNuXjbwN5th9XDEK7N+OaXsmRnN4p5bKf8Eh6D6+Kfh2wLyoe2B+mN2zSts3ug=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Helmet>
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
        <Route path="/profile" element={<Profile />} />

        <Route path="/coffee_bean" element={<CoffeeBean />} />

        <Route path="/coffee_menu" element={<CoffeeMenu />} />

        <Route path="/simulator" element={<Simulator />} />

        <Route path="/select" element={<Select/>}/>

        <Route path="/customcoffee" element={<Customcoffee/>} />

        <Route path="/suggestion" element={<Suggestion />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:id" element={<QuizDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
