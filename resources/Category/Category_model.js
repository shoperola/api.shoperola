import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const CategorySchema = new Schema(
  {
    category: { type: String, unique: true },
  },
  { timestamps: true }
);

export const Category = model("Category", CategorySchema);
