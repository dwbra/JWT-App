import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm";
import Home from "./components/Home/Home";
import Cookies from "universal-cookie";

function App() {
  const cookies = new Cookies();
  const [userSignedIn, setUserSignedIn] = useState(false);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthForm cookies={cookies} setUserSignedIn={setUserSignedIn} />
          }
        />
        <Route
          path="/home"
          element={
            userSignedIn ? (
              <Home cookies={cookies} setUserSignedIn={setUserSignedIn} />
            ) : (
              <AuthForm cookies={cookies} setUserSignedIn={setUserSignedIn} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
