import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const TvshowSchema = Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: "users",
    required: true,
  },
  title: {
    type: String,
  },
  plot_show: {
    type: String,
  },
  languageid: {
    type: String,
  },
  thumbnail: {
    type: String,
    default:
      "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/thumbnail-default.png",
  },
  bannerimage: {
    type: String,
    default:
      "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/banner-default.png",
  },
  price: {
    type: Number,
  },
  category:{ type: SchemaTypes.ObjectId, ref: "ContentCategories"},

  ////////////////////////////////////////imdb///////////////
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
  ipaddress: {
    type: String,
  },
  date: {
    type: Date,
    default: Date(),
  },
  time: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  wtime: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  season: [
    {
      type: Schema.Types.ObjectId,
      ref: "Season",
    },
  ],
});

TvshowSchema.index({ title: "text" });

export const Tvshow = model("Tvshow", TvshowSchema);
