import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const ContactSchema = new Schema(
  {
    name: {type: String, default:''},
    contact_no: {type: String, default:''},
    description: {type: String, default:''}
  },
  { timestamps: true }
);

export const Contact = model("Contact", ContactSchema);
