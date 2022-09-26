import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ideRoutes from "./routes/compiler.js";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const CONNECTION_URL =
  "mongodb+srv://arbaz:arbaz@cluster0.6p80aha.mongodb.net/?retryWrites=true&w=majority";
const PORT = 5000;

app.use("/api", ideRoutes);

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log("Server Running!!")))
  .catch((err) => console.log(err));
