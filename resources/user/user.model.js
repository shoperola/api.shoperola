import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
    },
    identities: {
      google: String,
      facebook: String,
      linkedin: String,
      twitter: String,
    },
    location: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    publicUrl: {
      type: String,
    },
    bannerImage: String,
    picture: String,
    featured: [{ type: String, data: String }],
    socials: {
      website: String,
      facebook: String,
      linkedin: String,
      twitter: String,
    },
    fees: {
      type: Number,
      default: 0,
    },
    settings: {
      country: {
        type: String,
        default: "India",
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = model("users", UserSchema);

export default User;
