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
    is_completed: { type: Boolean, default: false},
    // success: {
    //   type: String,
    //   enum: ["SUCCESS", "FAILED"]
    // },
    products: [{ type: SchemaTypes.ObjectId, ref: "Ecommerce" }],
    amount: { type: Number, default: 0 },
    address: { type: SchemaTypes.ObjectId, ref: "Address"},
    shipment_rate: {type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

export const Orders = model("Orders", OrdersSchema);
