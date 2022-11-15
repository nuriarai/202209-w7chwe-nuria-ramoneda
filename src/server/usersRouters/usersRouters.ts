import express from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/userControllers/userControllers.js";

const usersRouter = express();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", loginUser);

export default usersRouter;
