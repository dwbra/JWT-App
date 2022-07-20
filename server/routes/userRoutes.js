import express from "express";
import { createUser, loginUser } from "../controllers/userController.js";

//initialise express router to gain access to all routing methods
const router = express.Router();

//create a get request pathway for the frontend to pull users playlists
router.post("/create-user", createUser);
router.post("/login-user", loginUser);

export default router;
