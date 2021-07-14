import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const LessonSchema = Schema(
  {
    madeBy: {
      type: SchemaTypes.ObjectId,
      ref: "users",
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
    launchDate: {
      type: Date,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    views: { type: Number, default: 0 },
    studio_id: { type: SchemaTypes.ObjectId, ref: "studios" },
    ////////////////////////////////////////IMDB - METADATA///////////////////////////////////////////
    Id: {
      type: String,
      default: "",
    },
    directors: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    genres: {
      type: String,
      default: "",
    },
    Languages: {
      type: String,
      default: "",
    },
    RuntimeStr: {
      type: String,
      default: "",
    },
    Plot: {
      type: String,
      default: "",
    },
    Actors_list: [
      {
        id: String,
        name: String,
        image: String,
        asCharacter: String,
      },
    ],
    Writers: {
      type: String,
      default: "",
    },
    Ratings: {
      imDb: { type: String, default: "" },
      metacritic: { type: String, default: "" },
      theMovieDb: { type: String, default: "" },
      rottenTomatoes: { type: String, default: "" },
      tV_com: { type: String, default: "" },
      filmAffinity: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Lesson = model("lessons", LessonSchema);
