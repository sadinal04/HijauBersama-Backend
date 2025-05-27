import mongoose, { Schema, Document, Types } from "mongoose";

interface IReply extends Document {
  isi: string;
  author: Types.ObjectId;           // tipe ObjectId
  waktu: Date;
}

interface IPost extends Document {
  judul: string;
  isi: string;
  author: Types.ObjectId;           // tipe ObjectId
  waktu: Date;
  replies: Types.DocumentArray<IReply>;
}

const ReplySchema = new Schema<IReply>({
  isi: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },  // refer ke model User
  waktu: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>({
  judul: { type: String, required: true },
  isi: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },  // refer ke model User
  waktu: { type: Date, default: Date.now },
  replies: [ReplySchema],
});

export default mongoose.model<IPost>("Post", PostSchema);
