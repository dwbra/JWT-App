import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons/";
import { Input, Button, InputAdornment, IconButton } from "@material-ui/core/";
import axios from "axios";

function AuthForm(props: any) {
  const { setUserSignedIn, cookies } = props;
  const navigate = useNavigate();
  //set the initial state for the auth form to be signin
  const [isSignup, setIsSignup] = useState(false);
  //create a new set of data for the form and set the initial state as the empty fields above
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmedPassword: ""
  });
  //create new set of state to hold the falsy value for show password
  const [showPassword, setShowPassword] = useState(false);
  //onclick, use the setShowPassword function above to alter the state and make the showPassword value truthy
  const handleShowPassword = () => setShowPassword(!showPassword);

  //onclick function to handle if a user wants to sign in or sign up.
  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  //handle the data once auth form submitted
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //if the user already exists and wants to log in
    if (isSignup === false) {
      axios
        .post("http://localhost:5001/user/login-user", formData)
        .then((response) => {
          // console.log(response);
          // let data = response.data;
          const rToken = response.data.newRefreshTkn;
          // console.log(rToken);
          // setTokens(data);
          cookies.set("refreshToken", rToken, { path: "/" });
          // console.log(cookies.get("refreshToken"));
          setUserSignedIn(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //if they are creating a new user
      axios
        .post("http://localhost:5001/user/create-user", formData)
        .then((response) => {
          console.log(response);
          // let data = response.data;
          // setTokens(data);
          setUserSignedIn(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    navigate("/home");
  };

  //when any input field in the formData state is updated it will take a copy of the initial state
  //and save the new value in the corresponding name field.
  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // console.log(event.target.value);
  };

  return (
    <div className="authForm">
      <h3>{isSignup ? "Sign Up" : "Sign In"}</h3>
      <form onSubmit={handleSubmit} className="authform">
        {isSignup && (
          <>
            <Input
              required
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
          </>
        )}
        <Input
          required
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="johnsmith@email.com"
        />
        <Input
          required
          name="password"
          placeholder="Password"
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleShowPassword}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {isSignup && (
          <Input
            required
            name="confirmedPassword"
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
          />
        )}
        <Button type="submit" variant="contained" color="primary">
          {isSignup ? "Sign Up" : "Sign In"}
        </Button>
        <Button onClick={switchMode}>
          {isSignup
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign Up"}
        </Button>
      </form>
    </div>
  );
}

export default AuthForm;
