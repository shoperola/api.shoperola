import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const RelationSchema = new Schema(
  {
    subscriber: { type: SchemaTypes.ObjectId, ref: "clients" },
    instructor: { type: SchemaTypes.ObjectId, ref: "users" },
    amount: Number,
  },
  { timestamps: true }
);

RelationSchema.index({ subscriber: 1, instructor: 1 }, { unique: true });

export const subscriberRelation = model(
  "subscribers-relations",
  RelationSchema
);
