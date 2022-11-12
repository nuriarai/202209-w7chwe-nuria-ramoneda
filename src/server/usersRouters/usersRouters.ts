import express from "express";
import { registerUser } from "../controllers/userControllers/userControllers.js";

const usersRouter = express();

usersRouter.post("/register", registerUser);

export default usersRouter;
