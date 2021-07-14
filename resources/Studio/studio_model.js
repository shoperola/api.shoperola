import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const StudiSchema = Schema({
  duration: String,
  current_time: Date,
  url:{ type:String},
  product: {
    type: SchemaTypes.ObjectId,
    ref: "Ecommerce",
  },
  videoId: { type: SchemaTypes.ObjectId,
    ref: "lessons"},
  userID: { type: SchemaTypes.ObjectId, ref: "users" },
});

export const Studio = model("Studio", StudiSchema);
