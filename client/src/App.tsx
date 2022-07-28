import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm";
import Home from "./components/Home/Home";
import Cookies from "universal-cookie";

function App() {
  const [tokens, setTokens] = useState({});
  const cookies = new Cookies();

  //   console.log(tokens);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<AuthForm setTokens={setTokens} cookies={cookies} />}
        />
        <Route
          path="/home"
          element={<Home tokens={tokens} cookies={cookies} />}
        />
      </Routes>
    </>
  );
}

export default App;
