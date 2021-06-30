import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const TransactionSchema = new Schema(
  {
    processed_by: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },
    confirmationID: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    client: {
      type: SchemaTypes.ObjectId,
      ref: "clients",
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: "users",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["monthly", "yearly"],
    },
    status: {
      type: String,
      required: true,
      enum: ["SUCCESS", "FAILED"],
    },
  },
  { timestamps: true }
);

TransactionSchema.index({ userID: 1, clientID: 1 });

export const Transaction = model("transactions", TransactionSchema);
