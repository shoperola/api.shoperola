import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const AddressSchema = new Schema(
  {
    Name: { type: String },
    Address_Line_1: { type: String },
    Address_Line_2: { type: String },
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    Pin_Code: { type: Number },
    Contact_Number: { type: Number },
    userID: { type: SchemaTypes.ObjectId, ref: "clients" },
  },
  { timestamps: true }
);

export const Address = model("Address", AddressSchema);
