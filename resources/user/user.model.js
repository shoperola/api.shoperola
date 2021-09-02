import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";
import md5 from "md5";
import { Payment } from "../payments/payments.model";
import { SECRETS } from "../../util/config";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email_to_send:{
      type: String,
     // required: true,
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
    username: {
      type: String,
      trim: true,
      unique: true,
      default: "",
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
    is_verified: { type: Boolean, default: false},
    publicUrl: {
      type: String,
      default: "",
    },
    bannerImage: {
      type: String,
      default:
        "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/banner-default.png",
    },
    picture: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    featured: [
      {
        url: String,
      },
    ],
    categories: [{ type: SchemaTypes.ObjectId, ref: "Category" }],
    websiteLink: {
      type: String,
      default: "",
    },
    facebookLink: {
      type: String,
      default: "",
    },
    linkedinLink: {
      type: String,
      default: "",
    },
    twitterLink: {
      type: String,
      default: "",
    },
    instagramLink: {
      type: String,
      default: "",
    },
    feesPerMonth: {
      type: Number,
      default: 0,
    },
    feesPerYear: {
      type: Number,
      default: 0,
    },
    settings: {
      country: {
        type: String,
        default: "",
      },
      currency: {
        type: String,
        default: "",
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

export const generateUniqueUserName = async (
  proposedName,
  firstName,
  lastName
) => {
  const doc = await User.findOne({ username: proposedName });
  if (doc) {
    const name = `${proposedName}.${md5([
      firstName,
      lastName,
      Date.now(),
    ]).slice(0, 5)}`;
    return await generateUniqueUserName(name, firstName, lastName);
  }
  console.log(proposedName, firstName, lastName);
  return proposedName;
};

UserSchema.pre("save", async function (next) {
  if (
    !this.isModified("password") &&
    !this.isModified("username") &&
    !this.isModified("picture")
  ) {
    return next();
  }
  this.username = await generateUniqueUserName(
    `${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}`,
    this.firstName,
    this.lastName
  );

  this.publicUrl = `${SECRETS.domain_url}/${this.username}`;

  const params = {
    name: `${this.firstName} ${this.lastName}`,
    size: 256,
    rounded: true,
    background: "3d1f98",
    color: "fff",
  };
  this.picture = `https://ui-avatars.com/api/?${new URLSearchParams(
    params
  ).toString()}`;

  try {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next) {
    const userID = this.getFilter()["_id"];
    console.log("DELETING USER", userID);
    await Payment.findOneAndDelete({ userID });
    next();
  }
);

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
