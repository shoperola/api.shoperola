import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const VariantSchema = Schema({
  
  title: { type: String},
  variant_title: [{ type: String}],
  variant_price: [{type: Number}],
  variant_quantity: [{ type: Number}],
  variant_sku: [{ type:String}]
  //userID: { type: SchemaTypes.ObjectId, ref: "users" },
  

});

export const Variants = model("Variants", VariantSchema);
