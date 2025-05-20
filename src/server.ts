import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./utils/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import forumRoutes from "./routes/forumRoutes";
import adminAuthRoutes from "./routes/adminAuthRoutes";
import challengeRoutes from "./routes/challengeRoutes";
import publicChallengeRoutes from "./routes/publicChallengeRoutes";
import submissionRoutes from "./routes/submissionRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URI;
console.log("MONGO_URI:", mongoURI);

if (!mongoURI) {
  console.error("Error: MONGO_URI environment variable is not set!");
  process.exit(1);
}

connectDB(mongoURI);

app.use(cors());

// limit size
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/admin/challenges", challengeRoutes);
app.use("/api/challenges", publicChallengeRoutes);
app.use("/api/submissions", submissionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
