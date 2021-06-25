import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";

const ClientSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

export const Client = model("clients", ClientSchema);
