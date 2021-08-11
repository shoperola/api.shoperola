import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const FeaturedSchema = new Schema(
  {
    feautred_product: {type: SchemaTypes.ObjectId, ref: "Ecommerce" , unique: true},
    feautred_image: { type: String, default:''},
    status: { type: String, enum:['active','inactive'] ,default: 'active'},
    userID: { type: SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export const Featured = model("Featured", FeaturedSchema);
