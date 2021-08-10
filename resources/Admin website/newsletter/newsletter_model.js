import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const NewsletterSchema = new Schema(
  {
    email: {type: String, default:''},
    ip_address: {type: String, default:''}
  },
  { timestamps: true }
);

export const Newsletter = model("Newsletter", NewsletterSchema);
