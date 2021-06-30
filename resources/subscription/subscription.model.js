import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const SubscriptionSchema = new Schema(
  {
    subscriber: { type: SchemaTypes.ObjectId, ref: "clients" },
    instructor: { type: SchemaTypes.ObjectId, ref: "users" },
    amount: {
      type: Number,
      default: 0,
    },
    subType: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    subStart: {
      type: Date,
      default: "",
    },
    subEnd: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ subscriber: 1, instructor: 1 }, { unique: true });

export const Subscription = model("subscriptions", SubscriptionSchema);
