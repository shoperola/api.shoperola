import mongoose from "mongoose";
const { Schema,SchemaTypes, model } = mongoose;

const TaxSchema = new Schema({
  tax_name: {type: String, default: '', required:true, unique: true},
  tax_percentage: {type: Number, default:0, required:true, unique:true},
  userID: { type: SchemaTypes.ObjectId, ref: "users" }
});

export const Tax = model("Tax", TaxSchema);
