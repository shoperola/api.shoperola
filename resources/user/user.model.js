import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
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
      required: true,
    },
    identities: {
      google: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
    },
    services: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    publicUrl: {
      type: String,
      default: "",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    picture: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    featured: [{ type: String, data: String }],
    socials: {
      website: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
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
    reviews: [
      {
        writtenBy: SchemaTypes.ObjectId,
        text: String,
        timestamp: Date,
        replied: Boolean,
        reply: String,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") && !this.isModified("publicUrl")) {
    return next();
  }
  this.publicUrl = `https://konsult-member.com/${
    this._id
  }/${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}`;

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function (password) {
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
