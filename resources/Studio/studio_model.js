import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const StudiSchema = Schema({
  duration: String,
  current_time: [String],
  url: { type: String },
  products: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Ecommerce",
    },
  ],
  videoId: { type: SchemaTypes.ObjectId, ref: "lessons" },
  CTA_product: String,
  CTA_shop: String,
  userID: { type: SchemaTypes.ObjectId, ref: "users" },
});

export const Studio = model("Studio", StudiSchema);
