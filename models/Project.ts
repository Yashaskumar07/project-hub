import mongoose, { Schema, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    status: { type: String, enum: ["Idea", "Completed"], default: "Idea" },
    githubLink: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Project = models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
