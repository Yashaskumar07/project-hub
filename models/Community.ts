// models/Community.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  members: string[];
}

const CommunitySchema = new Schema<ICommunity>({
  name: { type: String, required: true },
  members: [{ type: String }], // store user IDs
});

const Community =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;
