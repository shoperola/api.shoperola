import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const OrdersSchema = Schema(
  {
    client: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "clients",
    },
    user: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "users",
    },
    ip: {
      type: String,
      required: true,
    },
    processed_by: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      default: false,
    },
    products: [{ type: SchemaTypes.ObjectId, ref: "Ecommerce" }],
    total_price: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

export const Orders = model("Orders", OrdersSchema);
