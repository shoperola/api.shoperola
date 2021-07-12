import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const EcommerceSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    price: Number,
    sale_price: Number,
    sku: String,
    quantity: Number,
    track_quantity: Boolean,
    continue_selling: Boolean,
    category: { type: SchemaTypes.ObjectId, ref: "Category" },
    userID: { type: SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export const Ecommerce = model("Ecommerce", EcommerceSchema);
