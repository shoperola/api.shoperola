import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";

const ClientSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
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
  cartid: {
    type: SchemaTypes.ObjectId,
    ref: "Cart",
  },
  watchlist: { type: SchemaTypes.ObjectId, ref: "Watchlist" },
});

export const Client = model("clients", ClientSchema);
