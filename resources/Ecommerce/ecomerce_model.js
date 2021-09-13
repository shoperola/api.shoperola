import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;
const variantSchema = new Schema({
  variant: String,
  variant_price: Number,
  variant_quantity: Number,
  variant_sku: String,
  variant_image: String
});

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
    total_price: { type: Number, default: 0 },
    sku: String,
    quantity: Number,
    track_quantity: Boolean,
    continue_selling: Boolean,
    variants:[variantSchema],
    variant_flag:{ type:Boolean, default:false},
    category: { type: SchemaTypes.ObjectId, ref: "Category" },
    status: { type: Boolean, default: true },
    userID: { type: SchemaTypes.ObjectId, ref: "users" },
    tax: { type: SchemaTypes.ObjectId, ref: "Tax" },
    //zero_tax: { type: SchemaTypes.ObjectId, ref: "ZeroTax" }
  },
  { timestamps: true }
);

export const Ecommerce = model("Ecommerce", EcommerceSchema);
