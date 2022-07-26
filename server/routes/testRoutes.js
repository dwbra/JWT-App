import express from "express";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

//initialise express router to gain access to all routing methods
const router = express.Router();

//create a get request pathway for the frontend to pull users playlists
router.get("/", verifyToken, (req, res) => {
  res.status(200).json("Welcome to homepage");
});

export default router;
