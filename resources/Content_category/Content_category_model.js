import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const ContentCategoriesSchema = new Schema(
  {
    name:{type:String,unique:true},
    type:{type:String},
    userID: { type: SchemaTypes.ObjectId, ref: "users" }
  },
  
  { timestamps: true }
);

export const ContentCategories = model("ContentCategories", ContentCategoriesSchema);
