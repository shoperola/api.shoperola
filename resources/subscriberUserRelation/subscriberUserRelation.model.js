import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const RelationSchema = new Schema(
  {
    subscriber: SchemaTypes.ObjectId,
    instructor: SchemaTypes.ObjectId,
  },
  { timestamps: true }
);

RelationSchema.index({ subscriber: 1, instructor: 1 }, { unique: true });

export const subscriberRelation = model(
  "subscribers-relations",
  RelationSchema
);
