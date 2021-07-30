import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const BannerSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  userID: {
    type: SchemaTypes.ObjectId,
    ref: "users",
  },
  bannerimage: {
    type: String,
    required: true,
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  category: { type: String},
});

export const Banner = model("Banner", BannerSchema);
