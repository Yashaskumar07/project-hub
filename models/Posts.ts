import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  createdBy: mongoose.Types.ObjectId;
  community: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
