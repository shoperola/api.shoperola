import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const SocialSchema = Schema({
    facebook:{
        type:String
    },
    twitter:{
        type:String
    },
    instagram:{
        type:String
    },
    linkedin:{
        type:String
    },
    userID: {type: SchemaTypes.ObjectId, ref: "users"}
},
{timestamps: true});

export const ConfigSocial = model("ConfigSocial", SocialSchema);
