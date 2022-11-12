import "./loadEnvirontment.js";
import environtment from "./loadEnvirontment.js";
import startServer from "./server/index.js";
import connectDb from "./database/index.js";
import app from "./app.js";

const { port, dbUrl } = environtment;

await connectDb(dbUrl);
await startServer(app, +port);
