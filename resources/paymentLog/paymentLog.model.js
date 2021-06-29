import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const PaymentLogSchema = Schema(
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
    paymentType: {
      type: String,
      enum: ["monthly", "yearly"],
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentLog = model("paymentlogs", PaymentLogSchema);
