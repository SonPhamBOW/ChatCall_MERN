import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRouter from "../server/routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(cookieParser());

app.disable("x-powerd-by");

app.get("/", (req, res) => {
  res.json({
    msg: "Hello world",
  });
});

// Auth apis
app.use("/api", authRouter);

// User apis
app.use("/api", userRouter);

connectDB().then(() => {
  try {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Cannot connect to the server");
  }
});
