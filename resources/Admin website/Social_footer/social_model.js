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
    }
});

export const Social = model("Social", SocialSchema);
