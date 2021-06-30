import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const SubscriptionSchema = new Schema(
  {
    subscriber: { type: SchemaTypes.ObjectId, ref: "clients" },
    instructor: { type: SchemaTypes.ObjectId, ref: "users" },
    amount: Number,
    subType: {
      type: String,
      enum: ["monthly", "yearly"],
    },
    subEnd: {
      type: Date,
    },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ subscriber: 1, instructor: 1 }, { unique: true });

export const Subscription = model("subscriptions", SubscriptionSchema);
