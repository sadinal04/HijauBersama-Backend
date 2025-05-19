import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  benefit: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
