import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import forumRoutes from "./routes/forumRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// limit size
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

connectDB(process.env.MONGO_URI!);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/forum", forumRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
