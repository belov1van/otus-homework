import mongoose from "mongoose";

const elementSchema = new mongoose.Schema({
  name: String,
  framework: String,
  rating: Number,
  demoUrl: String,
  docsUrl: String,
  description: String,
});

export default mongoose.model("Element", elementSchema);
