import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const RelationSchema = new Schema(
  {
    subscriber: SchemaTypes.ObjectId,
    instructor: SchemaTypes.ObjectId,
  },
  { timestamps: true }
);

export const subscriberRelation = model(
  "subscribers-relations",
  RelationSchema
);
