import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const TransactionSchema = new Schema(
  {
    processed_by: {
      type: String,
      enum: ["stripe", "paypal", "razorpay"],
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
    clientID: {
      type: SchemaTypes.ObjectId,
      ref: "clients",
    },
    userID: {
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
    appointment: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

TransactionSchema.index({ userID: 1, clientID: 1 });

export const Transaction = model("transactions", TransactionSchema);
