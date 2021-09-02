import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;


const appsSchema=Schema({
    androidappname: {
        type: String
    },
    androidapp: {
        type: String,
        default:
          "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
      },
      iosappname: {
        type: String
    },
      iosapp: {
        type: String,
        default:
          "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
      },
      androidtvname: {
        type: String
    },
      androidtv: {
        type: String,
        default:
          "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
      },
      appletvname: {
        type: String
    },
      appletv: {
        type: String,
        default:
          "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
      },
      fireostvname: {
        type: String
    },
      fireostv: {
        type: String,
        default:
          "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
      },
      userID: {type: SchemaTypes.ObjectId, ref: "users"}
},{timestamps: true});

export const Apps= model("apps", appsSchema);