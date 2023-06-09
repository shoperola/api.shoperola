import mongoose from "mongoose";
const { Schema, SchemaTypes,model } = mongoose;

const SeasonSchema = Schema({
  number: {
    type: Number,
    default: 1,
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: "users",
    required: true,
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
  launchDate:{
    type: Date,
    default: ""
  }
});

export const Season = model("Season", SeasonSchema);
