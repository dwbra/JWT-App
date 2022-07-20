import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";

//get access to env variables
dotenv.config();
//initialise express
const app = express();
//allow the app to use json
app.use(express.json());
//allow the app to work with cors in local env
app.use(cors());
//set json data transfer limits
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//set a port or use a default
const PORT = process.env.PORT || 5001;

//set routes for the app to use
app.use("/user", userRoutes);

//establish a connection to the db and initialise the server
mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch(error => console.log(error.message));
