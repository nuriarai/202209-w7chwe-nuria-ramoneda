import environtment from "./loadEnvirontment.js";
import express from "express";
import startServer from "./server/index.js";
import connectDb from "./database/index.js";

const app = express();
const { port, dbUrl } = environtment;

await connectDb(dbUrl);
await startServer(app, +port);
