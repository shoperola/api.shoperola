import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;
const variantSchema = new Schema({
  variant: String,
  variant_price: Number,
  variant_quantity: Number,
  variant_sku: String,
  variant_image: String
});











