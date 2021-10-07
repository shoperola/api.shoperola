import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const MachineSchema = new Schema({
  cartid: {type:SchemaTypes.ObjectId, ref:'carts'},
  status: {
    type: Boolean,
    default: false,
  }
},{timestamps: true});

export const Machine = model("machine", MachineSchema);
