import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  banner: String,
  addedBy: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "users",
  },
});

export const Subject = model("subjects", SubjectSchema);
