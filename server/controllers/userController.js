import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/userModel.js";

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
    const hashedPassword = await bcrypt.hash(password, 12);
    //create a document with the user data using the User Model
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    });
    //generate a jwt access token
    //https://www.npmjs.com/package/jsonwebtoken
    const accessToken = jwt.sign(
      { email: result.email, id: result._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const loginUser = async (req, res) => {
  //   const display = req.body
  //     .then(data => {
  //       console.log(data);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
};
