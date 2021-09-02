import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const AdminAddressSchema = new Schema(
  {
    company_name:{
        type:String
    },
    AdminAddress:{
        type:String
    },
    city:{
        type:String
    },
    state: {
        type:String
    },
    country:{
        type:String
    },
    pincode:{
        type:String
    },
    website:{
        type:String
    },
    contact_number:{
        type:String
    },
    email: {
        type:String
    },
    userID: {type: SchemaTypes.ObjectId, ref: "users"}
  },
  { timestamps: true }
);

export const UserAddress = model("UserAddress", AdminAddressSchema);
