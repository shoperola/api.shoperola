import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const StudiSchema = Schema({
  duration: String,
  current_time: [{ type:Date}],
  url:{ type:String},
  product: {
    type: SchemaTypes.ObjectId,
    ref: "Ecommerce",
  },
  videoId: { type: SchemaTypes.ObjectId,
    ref: "lessons"},
    Cta_products:{type: String},
    Cta_shop:{ type:String},
  userID: { type: SchemaTypes.ObjectId, ref: "users" },
});

export const Studio = model("Studio", StudiSchema);
