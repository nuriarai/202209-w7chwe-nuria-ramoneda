import express from "express";
import morgan from "morgan";
import { generalError, notFoundError } from "./server/middlewares/error.js";
import usersRouter from "./server/usersRouters/usersRouters.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
