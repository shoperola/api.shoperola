import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";

const ClientSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  cartid: {
    type: SchemaTypes.ObjectId,
    ref: "Cart",
  },
  coupons_used: [{ type: SchemaTypes.ObjectId, ref: "Coupon"}],
  userID: { type: SchemaTypes.ObjectId, ref: "users" },
  machine_id:{ type: String,default:"MACHINECODE"}

});

export const Client = model("clients", ClientSchema);

