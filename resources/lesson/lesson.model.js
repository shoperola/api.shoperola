import mongoose from "mongoose";
import { Studio } from "../Studio/studio_model";
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
    languageid: {
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
      default:
        "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
    },
    banner: {
      type: String,
      default:
        "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/banner-default.png",
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

LessonSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next) {
    const studio_id = this.getFilter()["studio_id"];
    console.log("DELETING STUDIO", studio_id);
    await Studio.findByIdAndDelete(studio_id);
    next();
  }
);

LessonSchema.index({ title: "text", description: "text" });

export const Lesson = model("lessons", LessonSchema);
