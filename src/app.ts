import express from "express";
import morgan from "morgan";
import usersRouter from "./server/usersRouters/usersRouters.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

export default app;
