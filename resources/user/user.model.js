import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
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

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

UserSchema.methods.checkPassword = (password) => {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = model("users", UserSchema);
