import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const OrderBeforeConfirmSchema = Schema(
  {
    userID: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "users",
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const OrderBeforeConfirm = model(
  "OrderBeforeConfirm",
  OrderBeforeConfirmSchema
);
