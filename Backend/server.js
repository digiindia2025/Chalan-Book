import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./db/index.js";
dotenv.config();

const app = express();



app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();



import AuthRoute from "./routes/Auth.route.js";
import clientRoute from "./routes/Client.route.js";
import challanRoute from "./routes/Challan.route.js";
import pdfRoute from "./routes/pdf.route.js";
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/client", clientRoute);
app.use("/api/v1/challan", challanRoute);
app.use("/api/v1/pdf", pdfRoute);
app.get("/", (req, res) => {
  res.send("API is running...!!");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});