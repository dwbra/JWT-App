import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm";
import Home from "./components/Home/Home";
import Cookies from "universal-cookie";

function App() {
  //initalize cookies to then pass to children components
  const cookies = new Cookies();
  //initalize some state to pass to children components to control access to the application
  const [userSignedIn, setUserSignedIn] = useState(false);

  return (
    <>
      <Routes>
        <Route
          path="/"
          //use state to control if access is allowed on the home route to the homepage or auth screen
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
