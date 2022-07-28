import React, { useState, useEffect } from "react";
import AuthForm from "../AuthForm/AuthForm";
import axios from "axios";

function HiddenContent(props: any) {
  const { tokens } = props;
  const refreshToken = tokens.newRefreshTkn;
  // console.log(refreshToken);
  // const MINUTE_MS = 300000;
  // const test = 3000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(tokens).length === 0) {
        axios
          .post("http://localhost:5001/user/get-refresh-token", refreshToken)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }, test);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  return (
    <>
      <h1>HiddenContent</h1>
      <p>
        This is a page that can only be accessed via auth. It has refresh token
        wrapped around this so that it will consistently check if the token is
        expired.
      </p>
    </>
  );
}

export default HiddenContent;
