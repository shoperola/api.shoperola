import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const ContactSchema = new Schema(
  {
    name: {type: String, default:''},
    email: {type: String, default:''},
    message: {type: String, default:''},
    status: {type: String, enum: ['read','unread'], default:'read'},
    ip_address: {type: String, default:''}
  },
  { timestamps: true }
);

export const Contact = model("Contact", ContactSchema);
