import mongoose from "mongoose";
const { Schema, model,SchemaTypes } = mongoose;

var WatchlistTvSchema = new Schema({
  addedby: {
    type: SchemaTypes.ObjectId,
    ref: "Client"
},
  tvshow:[{ // will return an array of favorite dishes
      type: SchemaTypes.ObjectId,
      ref: "Tvshow"
  }],
}, {
    timestamps: true
});
// the schema is useless so far
export const WatchlistTv = model("WatchlistTv", WatchlistTvSchema);