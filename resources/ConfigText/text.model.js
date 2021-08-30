import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const TextSchema = Schema({
  title: {
    type: String,
    required: true
  },
  Addedon: {
    type: Date,
    required: true
  },
  Text:{
    type: String,
    required: true
  },
  timestamps: true
});

export const Text = model("configText", TextSchema);
