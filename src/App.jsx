import { Routes, Route } from "react-router-dom";
import React from "react";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Portfolio from "./Components/Portfolio";
import Buildportfolio from "./Components/Buildportfolio";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/buildportfolio" element={<Buildportfolio />} />

    </Routes>
  );
}

export default App;
