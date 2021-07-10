import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TvshowSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
  },
  plot_show: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  bannerimage: {
    type: String,
  },
  price: {
    type: Number,
  },

  tvshow_flag: {
    type: Boolean,
    default: false,
  },
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

export const Tvshow = model("Tvshow", TvshowSchema);