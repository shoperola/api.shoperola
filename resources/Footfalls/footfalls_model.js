import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;


const FootfallSchema=Schema({
  photo:{type:String,default:''}
},
  { timestamps: true }
  );

export const Footfall = model("Footfalls", FootfallSchema);