import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

var watchlistSchema = new Schema(
  {
    addedby: {
      type: SchemaTypes.ObjectId,
      ref: "Client",
    },
    video: [
      {
        // will return an array of favorite dishes
        type: SchemaTypes.ObjectId,
        ref: "lessons",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// the schema is useless so far
export const Watchlist = model("Watchlist", watchlistSchema);
