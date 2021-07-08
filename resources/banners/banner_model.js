import mongoose from "mongoose";
const { Schema, model } = mongoose;

const BannerSchema = Schema({
  title: {
    type: String,
    required: true,
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
  category: {
    type: String,
    required: true,
  },
});

export const Banner = model("Banner", BannerSchema);
