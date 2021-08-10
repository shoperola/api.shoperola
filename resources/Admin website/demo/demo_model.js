import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const DemoSchema = new Schema(
  {
    name: {type: String, default:''},
    email: {type: String, default:''},
    message: {type: String, default:''},
    contact_number: {type: Number, default:''},
    country: {type: String, default:''},
    time_slot:{type:Date, default: Date.now()},
    status: {type: String, enum: ['read','unread'], default:'read'},
    ip_address: {type: String, default:''}
  },
  { timestamps: true }
);

export const Demo = model("Demo", DemoSchema);
