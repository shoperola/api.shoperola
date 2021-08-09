import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const DemoSchema = new Schema(
  {
    name: {type: String, default:''},
    email: {type: String, default:''},
    message: {type: String, default:''},
    time_slot:{type:Date, default: Date.now()},
  },
  { timestamps: true }
);

export const Demo = model("Demo", DemoSchema);
