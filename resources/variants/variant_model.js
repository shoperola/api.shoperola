import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const VariantSchema = Schema({
  options:[{ type:String}],
  value: [{ type:String}],
  variant_title: [{ type: String}],
  variant_price: [{type: Number}],
  variant_quantity: [{ type: Number}],
  variant_sku: [{ type:String}],
  variant_image: [{ type:String}],
  variant_total:[{ type:Number}],
  tax: { type: SchemaTypes.ObjectId, ref: "Tax" },
  userID: { type: SchemaTypes.ObjectId, ref: "users" }

});

export const Variants = model("Variants", VariantSchema);
