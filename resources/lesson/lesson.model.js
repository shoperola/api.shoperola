import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const LessonSchema = Schema(
  {
    madeBy: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    subject: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "subjects",
    },
    language: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "languages",
    },
    live: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    launch: {
      type: Boolean,
      default: false,
    },
    launchDate: {
      type: Date,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },

    ////////////////////////////////////////IMDB - METADATA///////////////////////////////////////////
    Id: {
      type: String,
    },
    directors: {
      type: String,
    },
    type: {
      type: String,
    },
    year: {
      type: String,
    },
    image: {
      type: String,
    },
    genres: {
      type: Array,
    },
    Languages: {
      type: Array,
    },
    RuntimeStr: {
      type: String,
    },
    Plot: {
      type: String,
    },
    Actors_list: {
      type: Array,
    },
    Writers: {
      type: String,
    },
    Ratings: {
      type: Array,
    },
  },
  { timestamps: true }
);

export const Lesson = model("lessons", LessonSchema);
