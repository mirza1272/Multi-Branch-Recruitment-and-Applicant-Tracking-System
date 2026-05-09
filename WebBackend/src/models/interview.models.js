import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: [true, "Application is required"],
      unique: true, // One interview per application
    },
    date: {
      type: Date,
      required: [true, "Interview date is required"],
    },
    time: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Online", "In-Person", "Phone"],
      default: "Online",
    },
    meetingLink: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);
