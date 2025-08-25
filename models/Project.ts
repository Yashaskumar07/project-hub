import mongoose, { Schema, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    difficulty: { 
      type: String, 
      enum: ["Beginner", "Intermediate", "Advanced"], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Idea", "Completed"], 
      default: "Idea" 
    },
    githubLink: { type: String },
    images: [{ type: String }],

    // ✅ Likes (array of userIds)
    likes: [{ type: String }],

    // ✅ Comments (each with userId, text, createdAt)
    comments: [
      {
        userId: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Project = models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
