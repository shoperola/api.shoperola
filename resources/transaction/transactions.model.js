import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const TransactionSchema = new Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    checksum: {
      type: String,
      required: true,
    },
    errorCode: {
      type: String
    },
    userID: {
      type: SchemaTypes.ObjectId,
      ref: "users",
    },
    errorMessage: {
      type: String
    },
    merchantTxnId: {
      type: String,
      required: true,
    },
    txnId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["SUCCESS", "FAILED","INITIATED"],
    },
  },
  { timestamps: true }
);

export const Transaction = model("transactions", TransactionSchema);
