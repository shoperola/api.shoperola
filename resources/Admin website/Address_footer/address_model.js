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
    adminID:{type:SchemaTypes.ObjectId,ref:'admins'}
  },
  { timestamps: true }
);

export const AdminAddress = model("AdminAddress", AdminAddressSchema);
