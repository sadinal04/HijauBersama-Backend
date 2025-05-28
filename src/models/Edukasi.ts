import mongoose, { Schema, Document } from "mongoose";

export interface IEdukasi extends Document {
  title: string;
  type: "artikel" | "video";
  videoUrl?: string;    // wajib kalau type = "video"
  content?: string;     // wajib kalau type = "artikel"
  createdAt: Date;
  updatedAt: Date;
}

const EdukasiSchema = new Schema<IEdukasi>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["artikel", "video"], required: true },
    videoUrl: { type: String, required: function() { return this.type === "video"; } },
    content: { type: String, required: function() { return this.type === "artikel"; } },
  },
  { timestamps: true }
);

const Edukasi = mongoose.model<IEdukasi>("Edukasi", EdukasiSchema);
export default Edukasi;
