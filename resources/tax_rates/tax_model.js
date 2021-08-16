import mongoose from "mongoose";
const { Schema,SchemaTypes, model } = mongoose;

const TaxSchema = new Schema({
  tax_name: {type: String, default: '', required:true},
  tax_percentage: {type: Number, default:'', required:true},
  userID: { type: SchemaTypes.ObjectId, ref: "users" }
});

export const Tax = model("Tax", TaxSchema);
