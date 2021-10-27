import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const PaymentLogSchema = Schema(
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
    success: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: String,
      enum: ["monthly", "yearly", "Ecommerce"],
    },
    amount:{type: Number, default: 0},
    products: [{
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "Ecommerce"
      
    }],
  },
  {
    timestamps: true,
  }
);

export const PaymentLog = model("paymentlogs", PaymentLogSchema);
