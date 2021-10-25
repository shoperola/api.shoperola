import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;


const PhotoSchema=Schema({
  photo:{type:String,default:''},
  userID:{type:SchemaTypes.ObjectId,ref:"users"}
},
  { timestamps: true }
  );

export const Photo= model("photo",PhotoSchema);