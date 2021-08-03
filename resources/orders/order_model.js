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
      type: Boolean
    },
    products: [{ type: SchemaTypes.ObjectId, ref: "Ecommerce" }],
    amount: { type: Number, default: 0 },
    address: { type: SchemaTypes.ObjectId, ref: "Address"}
  },
  {
    timestamps: true,
  }
);

export const Orders = model("Orders", OrdersSchema);
