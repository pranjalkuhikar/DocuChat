import express from "express";
import cors from "cors";
import indexRouter from "./routes/doc.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", indexRouter);

export default app;
