import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const CartSchema = new Schema(
  {
    products: [{ type: SchemaTypes.ObjectId, ref: "Ecommerce" }],
    total_price: { type: Number, default: 0 },
    quantity: {type:Number, default:1}
  },
  { timestamps: true }
);

export const Cart = model("Cart", CartSchema);
