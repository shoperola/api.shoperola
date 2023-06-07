import mongoose from "mongoose";
const { SchemaTypes, model, Schema } = mongoose;

const OrdersSchema = Schema(
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
    status: {
      type: String,
      default: "PENDING_PAYMENT",
      enum: ["PENDING_PAYMENT", "PAID", "SHIPPING", "DISPATCHED", "DELIVERED"],
    },
    totalPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      required: false,
      default: 0,
    },
    razorpay_payment_id: {
      type: String,
      required: false,
    },
    order_id: {
      type: String,
      required: false,
    },
    GSTPrice: {
      type: Number,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: false,
    },

    shipping_id: {
      type: String,
      required: false,
    },

    is_completed: { type: Boolean, default: false },
    is_abandoned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Orders = model("Orders", OrdersSchema);
