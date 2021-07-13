import mongoose from "mongoose";
const { Schema,SchemaTypes, model } = mongoose;

const StudiSchema = Schema({
time:{type:String},
product:{
    type: Schema.Types.ObjectId,
    ref: "Ecommerce",
  },
userID: { type: SchemaTypes.ObjectId, ref: "users" },

});

export const Studio = model("Studio", StudiSchema);
