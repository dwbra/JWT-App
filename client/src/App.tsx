import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm";
import HiddenContent from "./components/HiddenContent/HiddenContent";

function App() {
  const [tokens, setTokens] = useState({});

  //   console.log(tokens);

  return (
    <>
      <Routes>
        <Route path="/" element={<AuthForm setTokens={setTokens} />} />
        <Route path="/home" element={<HiddenContent tokens={tokens} />} />
      </Routes>
    </>
  );
}

export default App;
