import express from "express";
import { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes";

var cors = require("cors");
const mongoose = require("mongoose");

const app: Application = express();
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
dotenv.config();
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api", router);

app.listen(process.env.PORT, function () {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
