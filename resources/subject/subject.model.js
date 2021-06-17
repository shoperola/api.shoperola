import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
});

export const Subject = model("subjects", SubjectSchema);
