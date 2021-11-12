import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const OrdersSchema = Schema(
  {
    userID: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "users",
    },
    is_completed: { type: Boolean, default: false },
    is_abandoned: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

export const Orders = model("Orders", OrdersSchema);
