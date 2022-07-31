import React, { useState, useEffect, useRef } from "react";
import AuthForm from "../AuthForm/AuthForm";
import axios from "axios";

function Home(props: any) {
  //grab the functions from parent component via props
  const { cookies, setUserSignedIn } = props;
  //grab the refresh token from the browser which was set during auth.
  let refreshTkn = cookies.get("refreshToken");

  //useRef to stop the useEffect from firing on the initial render.
  //This is because on initial load the token has just been set and we only need to send a request to update
  //on the next re-render of the component however it may be triggered.
  const didMount = useRef(false);

  //useEffect to fire on all re-renders except the first to check if the user still has permission to view the component
  //console logging out the results to help illustrate the process
  useEffect(() => {
    if (didMount.current) {
      axios
        .post("http://localhost:5001/user/get-refresh-token", {
          refreshTkn: refreshTkn
        })
        .then((response) => {
          console.log(response);
          const newRefreshToken = response.data.newRefreshToken;
          console.log(newRefreshToken);
          cookies.set("refreshToken", newRefreshToken, { path: "/" });
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data);
          setUserSignedIn(false);
        });
    } else {
      didMount.current = true;
    }
  });

  //simple button to illustrate what happens on state change which forces a re-render
  let [buttonState, setButtonState] = useState(0);
  const exampleChangeSomeState = () => {
    setButtonState(buttonState++);
  };
  console.log(buttonState);

  return (
    <>
      <div className="homePage">
        <h1>HiddenContent</h1>
        <h2>
          This is a page that can only be accessed via auth. It has refresh
          token wrapped around this so that it will consistently check if the
          token is expired.
        </h2>
        <h3>
          If you watch in the inspector application tab, you will note that when
          the state changes, this will cause a re-render and that this will fire
          off the JWT useEffect function to check if the token is valid. If it
          is it stays the same, if not it is updated and reset in the cookie.
        </h3>
        <button onClick={exampleChangeSomeState}>
          Watch the state change and JWT token update
        </button>
      </div>
    </>
  );
}

export default Home;
