import mongoose from "mongoose";

const { Schema,model, SchemaTypes } = mongoose;


const EmailSchema= new Schema({
    title: {type: String},
    status: { type: String, enum:['active','inactive'] ,default: 'active'},
    subject: { type:String},
    body: { type:String},
    adminID: { type: SchemaTypes.ObjectId, ref: "users" },
},{timestamps: true});

export const Email= model("Email", EmailSchema);