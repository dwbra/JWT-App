import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//grab env variables
dotenv.config();

//import mongodb models
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";

//create helper functions for handling new access / refresh tokens using the secret keys to encrypt requests
const accessToken = id => {
  return jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s"
  });
};

const refreshToken = id => {
  return jwt.sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET);
};

//ensure users have an active token to view content on clientside
export const getRefreshToken = async (req, res) => {
  //grab the current token from the clientside
  const refreshTkn = req.body.refreshTkn;
  //if no token is passed throw error for clientside
  if (!refreshTkn) {
    return res.status(401).send("Token is required!");
  }
  //if a user has tried to manipulate the token and send a different token we run a check to verify
  const decode = jwt.verify(refreshTkn, process.env.REFRESH_TOKEN_SECRET);
  //if this fails we throw error to clientside
  if (!decode) {
    return res.status(403).send("Invalid token");
  }
  //however if this passes we now have access to the request data object which contains an id
  const user_id = decode.id;
  //now we check the mongodb db collection to see if a token exists already
  const findToken = await RefreshToken.findOne({ token: refreshTkn });
  //if not, we send back error message to clientside
  if (!findToken) {
    return res.status(403).send("Token has been expired. Sign in again.");
    //otherwise, we use the helper functions to encrypt the data.
  } else {
    const newAccessToken = accessToken(user_id);
    const newRefreshToken = refreshToken(user_id);
    //then in the mongodb db collection, if the token exists we grab that data and update it with the newly
    //generated tokens and set the third object param to true to replace the old values and not create a new db entry
    let new_token = await RefreshToken.findOneAndUpdate(
      { token: refreshTkn },
      { token: newRefreshToken },
      { new: true }
    );
    //finally we send back a 200 response and the newly created tokens for clientside consumption
    res.status(200).json({ newAccessToken, newRefreshToken });
  }
};

export const createUser = async (req, res) => {
  //destructure your user info from the request body object
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    //ensure the user doesn't already exist in the db before creating new user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    //although there should be client side validation, run on server as well to be sure
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    //create a hashed password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    //create a document with the user data using the User Model
    //using mongoose with mongodb the .create method returns a newly created object with an id.
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    });

    //again we use the helper functions to encrypt the data.
    const newAccessTkn = accessToken(result._id);
    const newRefreshTkn = refreshToken(result._id);

    //as this is a new user, we need to create a new token for them in the token db collection
    //its important we pass the token and the user, as we use the user in the model to link the two collections
    const generateNewRefreshToken = await RefreshToken.create({
      token: newRefreshTkn,
      user: result._id
    });

    //finally we send the tokens to the clientside for consumption.
    res.status(200).json({
      accessToken: newAccessTkn,
      refreshToken: newRefreshTkn,
      generateNewRefreshToken: generateNewRefreshToken
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const loginUser = async (req, res) => {
  // destructure data from req.body
  const { email, password } = req.body;
  try {
    //https://mongoosejs.com/docs/api.html#model_Model-find
    const loginUser = await User.findOne({ email });
    //if no user exists send back failure response
    if (!loginUser) return res.status(400).send("Cannot find user");
    //get the hashed password from the db response
    const hashedPassword = loginUser.password;
    //create the jwtUser object to create tokens with
    const jwtUserID = loginUser.id;
    //check that the password is correct and store in a const variable to use as truthy/falsy conditional
    const passwordCorrect = await bcrypt.compare(password, hashedPassword);
    //we use the helper functions to encrypt the data.
    const newAccessTkn = accessToken(jwtUserID);
    const newRefreshTkn = refreshToken(jwtUserID);
    //we find if a token exists in the token db collection
    const findToken = await RefreshToken.findOne({ user: jwtUserID });
    //check if user has passed the password verification
    if (passwordCorrect) {
      //if they have but don't have an active token create one
      if (!findToken) {
        const generateNewRefreshToken = await RefreshToken.create({
          token: newRefreshTkn,
          user: jwtUserID
        });
        //otherwise, find and update the current one
      } else {
        let existingUserToken = await RefreshToken.findOneAndUpdate(
          { user: jwtUserID },
          { token: newRefreshTkn },
          { new: true }
        );
      }
      //finally send back the tokens to frontend for clientside consumption
      res.status(200).json({
        newAccessTkn: newAccessTkn,
        newRefreshTkn: newRefreshTkn
      });
    } else {
      res.send("Password incorrect");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
