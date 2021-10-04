import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;


const appsSchema=Schema({
   
    androidapp: {
        type: String,
        default:
          "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
      },
      splashscreen: {
        type: String,
        default:
          "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
      },
      userID: {type: SchemaTypes.ObjectId, ref: "users"}
},{timestamps: true});

export const Apps= model("apps", appsSchema);