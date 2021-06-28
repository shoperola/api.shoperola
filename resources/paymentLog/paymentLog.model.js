import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const PaymentLogSchema = Schema(
  {
    clientID: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    userID: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    processed_by: {
      type: String,
      required: true,
    },
    paid_by: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    success: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentLog = model("paymentlogs", PaymentLogSchema);
