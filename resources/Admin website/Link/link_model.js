import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const LinkSchema = new Schema(
  {
    link1:{type: String},
    url1:{type: String},
    link2:{type: String},
    url2:{type: String},
    link3:{type: String},
    url3:{type: String},
    link4:{type: String},
    url4:{type: String}
  },
  
  { timestamps: true }

);

export const Link = model("Link", LinkSchema);
