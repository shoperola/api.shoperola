import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;
const EcommerceSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    price: Number,
    sale_price: Number,
    total_price: {
      type: Number,
      default: 0,
    },
    sku: String,
    quantity: Number,
    track_quantity: Boolean,
    sample_free: Boolean,
    sample_paid: Boolean,
    one_per_order: Boolean,
    one_per_person: Boolean,
    name: Boolean,
    number: Boolean,
    email: Boolean,
    message: String,
    featured: Boolean,
    continue_selling: Boolean,
    category: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
    },
    status: {
      type: Boolean,
      default: true,
    },
    userID: {
      type: SchemaTypes.ObjectId,
      ref: "users",
    },
    tax: {
      type: SchemaTypes.ObjectId,
      ref: "Tax",
    },
    //zero_tax: { type: SchemaTypes.ObjectId, ref: "ZeroTax" }
  },
  {
    timestamps: true,
  }
);

export const Ecommerce = model("Ecommerce", EcommerceSchema);
