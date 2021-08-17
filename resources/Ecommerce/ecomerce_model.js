import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const EcommerceSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    price: Number,
    sale_price: Number,
    total_price: { type:Number, default: 0 },
    sku: String,
    quantity: Number,
    track_quantity: Boolean,
    continue_selling: Boolean,
    category: { type: SchemaTypes.ObjectId, ref: "Category" },
    status: { type: Boolean, default: true },
    userID: { type: SchemaTypes.ObjectId, ref: "users" },
    tax: { type: SchemaTypes.ObjectId, ref: "Tax" }
  },
  { timestamps: true }
);

export const Ecommerce = model("Ecommerce", EcommerceSchema);
