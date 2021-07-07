import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SeasonSchema = Schema({
  number: {
    type: Number,
    default: 1,
  },
  episode: [
    {
      episodeNumber: {
        type: Number,
      },
      title: {
        type: String,
      },
      image: {
        type: String,
      },
      plot: {
        type: String,
      },
      video: {
        type: String,
      },
    },
  ],
  launch: {
    type: Boolean,
    default: false,
  },
});

export const Season = model("Season", SeasonSchema);
