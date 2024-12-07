import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import "dotenv/config";

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static("uploads"));

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5002;
  mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() =>
      app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    )
    .catch((error) => console.log(error.message));
}

export default app;
