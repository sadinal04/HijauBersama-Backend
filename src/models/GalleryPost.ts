import mongoose, { Schema, Document, Types } from "mongoose";

interface IComment {
  userId: Types.ObjectId;
  username: string;
  content: string;
  createdAt: Date;
}

interface IGalleryPost extends Document {
  uploader: Types.ObjectId;
  uploaderName: string;
  caption: string;
  imageUrl: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const GalleryPostSchema = new Schema<IGalleryPost>({
  uploader: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploaderName: { type: String, required: true },
  caption: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [CommentSchema],
}, { timestamps: true });

export default mongoose.model<IGalleryPost>("GalleryPost", GalleryPostSchema);
