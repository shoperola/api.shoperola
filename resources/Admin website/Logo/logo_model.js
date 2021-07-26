import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const LogoSchema = new Schema(
  {
    logo:{
        type: String
    }
  },
  { timestamps: true }
);

export const Logo = model("Logo", LogoSchema);
