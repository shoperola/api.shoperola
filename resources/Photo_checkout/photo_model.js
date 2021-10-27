import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;


const PhotoSchema=Schema({
  photo:{type:String,default:''},
  age:{type:Number,default:0},
  gender:{type:String,default:''},
  emotion:{type:String,default:''},
  userID:{type:SchemaTypes.ObjectId,ref:"users"}
},
  { timestamps: true }
  );

export const Photo= model("photo",PhotoSchema);