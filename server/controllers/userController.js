import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";

const accessToken = id => {
  return jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s"
  });
};

const refreshToken = id => {
  return jwt.sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET);
};

export const getRefreshToken = async (req, res) => {
  const refreshTkn = req.body.refreshToken;
  if (!refreshTkn) {
    return res.status(401).json("Token is required!");
  }
  const decode = jwt.verify(refreshTkn, process.env.REFRESH_TOKEN_SECRET);
  if (!decode) {
    return res.status(403).json("Invalid token");
  }
  const user_id = decode.id;
  const findToken = await RefreshToken.findOne({ token: refreshTkn });
  if (!findToken) {
    return res.status(403).json("Token has been expired. Sign in again.");
  } else {
    const newAccessToken = accessToken(user_id);
    const newRefreshToken = refreshToken(user_id);
    let new_token = await RefreshToken.findOneAndUpdate(
      { token: refreshTkn },
      { token: newRefreshToken },
      { new: true }
    );
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
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    });

    //generate a jwt access token
    //https://www.npmjs.com/package/jsonwebtoken
    const newAccessTkn = accessToken(result._id);
    const newRefreshTkn = refreshToken(result._id);

    const generateNewRefreshToken = await RefreshToken.create({
      token: newRefreshTkn,
      user: result._id
    });

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

    const newAccessTkn = accessToken(jwtUserID);
    const newRefreshTkn = refreshToken(jwtUserID);
    const findToken = await RefreshToken.findOne({ user: jwtUserID });

    if (passwordCorrect) {
      if (!findToken) {
        const generateNewRefreshToken = await RefreshToken.create({
          token: newRefreshTkn,
          user: jwtUserID
        });
      } else {
        let existingUserToken = await RefreshToken.findOneAndUpdate(
          { user: jwtUserID },
          { token: newRefreshTkn },
          { new: true }
        );
      }

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
