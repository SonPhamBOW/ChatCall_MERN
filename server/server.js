import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "../server/routes/auth.routes.js";
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.disable("x-powerd-by");

app.get("/", (req, res) => {
  res.json({
    msg: "Hello world",
  });
});

// Auth apis
app.use("/api", authRouter);

connectDB().then(() => {
  try {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Cannot connect to the server");
  }
});
