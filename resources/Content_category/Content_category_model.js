import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const CategoriesSchema = new Schema(
  {
    name:{type:String},
    type:{type:String},
    userID: { type: SchemaTypes.ObjectId, ref: "users" }
  },
  
  { timestamps: true }
);

export const Categories = model("Categories", CategoriesSchema);
