import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ideRoutes from "./routes/compiler.js";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const CONNECTION_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.6p80aha.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT;

app.use("/api", ideRoutes);

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log("Server Running!!")))
  .catch((err) => console.log(err));
