import mongoose, { Schema, model, models } from "mongoose";

const CommunitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Community = models.Community || model("Community", CommunitySchema);

export default Community;
