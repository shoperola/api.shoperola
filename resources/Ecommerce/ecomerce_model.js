import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const EcommerceSchema = new Schema(
  {
    title:{type:String},
    description:{type:String},
    image:{type:String},
    price:{type:Number},
    sale_price:{type:Number},
    sku:{type:String},
    quantity:{type:Number},
    category:{ type: SchemaTypes.ObjectId,
        ref: "Category",}
  },
  { timestamps: true }
);

export const Ecommerce = model("Ecommerce", EcommerceSchema);
