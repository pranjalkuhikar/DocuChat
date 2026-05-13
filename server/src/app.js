import express from "express";
import cors from "cors";
import { requestTimeout } from "./middleware/error-handler.js";
import indexRouter from "./routes/doc.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestTimeout(120000));

app.use("/api", indexRouter);

export default app;
