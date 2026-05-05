import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", branchSchema);
