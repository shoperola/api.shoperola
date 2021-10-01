import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const RackSchema = Schema(
  {
    rack11:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack12:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack13:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack14:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack15:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack16:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack21:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack22:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack23:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack24:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack25:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack26:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack31:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack32:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack33:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack34:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack35:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack36:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack41:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack42:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack43:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack44:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack45:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack46:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack51:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack52:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack53:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack54:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack55:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack56:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack61:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack62:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack63:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack64:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack65:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    rack66:{type: SchemaTypes.ObjectId, ref:'Ecommerce'},
    userID:{type: SchemaTypes.ObjectId, ref:'users'}
  },
  { timestamps: true }
);



export const Rack = model("rack", RackSchema);
