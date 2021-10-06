import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const OrdersSchema = Schema(
  {
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
    is_new: { type: Boolean, default: true},
    is_processing: { type: Boolean, default: false},
    is_delivered: { type: Boolean, default: false},
    is_returned: { type: Boolean, default: false},
    is_cancelled: { type: Boolean, default: false},
    is_dispatched: { type: Boolean, default: false},
    // success: {
    //   type: String,
    //   enum: ["SUCCESS", "FAILED"]
    // },
    products: [{ type: SchemaTypes.ObjectId, ref: "Ecommerce" }],
    amount: { type: Number, default: 0 },
    address: { type: SchemaTypes.ObjectId, ref: "Address"},
    //shipment_rate: { type: SchemaTypes.ObjectId, ref: "Shipping"}
  },
  {
    timestamps: true,
  }
);

export const Orders = model("Orders", OrdersSchema);
