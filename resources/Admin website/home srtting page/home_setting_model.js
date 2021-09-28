import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const HomePageSchema = new Schema(
  {
    hero_title:{
        type: String,
    },
    description:{
        type: String,
    },
    image_title:{
        type: String
    },
    section1_title:{
        type: String
    },
    description_1:{
        type: String
    },
    image_description_1:{
        type: String
    },
    section2_title:{
        type: String
    },
    description_2:{
        type: String
    },
    image_description_2:{
        type: String
    },
    section3_title:{
        type: String
    },
    description_3:{
        type: String
    },
    image_description_3:{
        type: String
    },
    section4_title:{
        type: String
    },
    description_4:{
        type: String
    },
    image_description_4:{
        type: String
    },
    adminID:{type:SchemaTypes.ObjectId,ref:'admins'}
  },
  { timestamps: true }
);

export const HomePage = model("HomePage", HomePageSchema);
