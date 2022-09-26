import mongoose from "mongoose";

const { Schema, model } = mongoose;

const JobSchema = new Schema({
  language: {
    type: String,
    required: true,
    enum: ["cpp", "py", "js"],
  },
  filepath: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  output: {
    type: String,
  },
});

// default export
const CodeRunnerJob = model("CodeRunnerJob", JobSchema);
export default CodeRunnerJob;
