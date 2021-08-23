import mongoose from "mongoose";
const { Schema,SchemaTypes, model } = mongoose;

const ShippingSchema = new Schema({
  shipping_name: { type: String, default:''},
  shipping_description: { type: String, default:''},
  shipping_rate: { type: Number, default: 0},
  shipping_country: { type: String, default: ""},
  shipping_state: { type: String, default: ""},
  status: { type: String, enum: ['active', 'inactive'], default: 'active'},
  userID: { type: SchemaTypes.ObjectId, ref: "users" }
});

export const Shipping = model("Shipping", ShippingSchema);
