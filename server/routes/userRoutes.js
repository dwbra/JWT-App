import express from "express";
import {
  createUser,
  loginUser,
  getRefreshToken
} from "../controllers/userController.js";

//initialise express router to gain access to all routing methods
const router = express.Router();

//create a get request pathway for the frontend to pull users playlists
router.post("/create-user", createUser);
router.post("/login-user", loginUser);
router.post("/get-refresh-token", getRefreshToken);

export default router;
