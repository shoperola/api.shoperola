import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";
import md5 from "md5";

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
    featured: [
      {
        url: String,
      },
    ],
    subjects: [
      {
        type: SchemaTypes.ObjectId,
        ref: "subjects",
        unique: true,
      },
    ],
    languages: [
      {
        type: SchemaTypes.ObjectId,
        ref: "languages",
        unique: true,
      },
    ],
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
    fees: {
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
    reviews: [
      {
        writtenBy: {
          type: SchemaTypes.ObjectId,
          ref: "clients",
        },
        text: String,
        timestamp: Date,
        replied: Boolean,
        reply: String,
      },
    ],
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

  this.publicUrl = `https://konsult-member.com/${this.username}`;

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

UserSchema.pre("remove", function (next) {
  Payment.deleteOne({ userID: this._id });
  next();
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

const PaymentsSchema = new Schema(
  {
    userID: {
      type: SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    paypal: {
      merchantId: String,
      merchantIdInPayPal: String,
      permissionsGranted: Boolean,
      consentStatus: Boolean,
      productIntentId: String,
      productIntentID: String,
      isEmailConfirmed: Boolean,
      accountStatus: String,
      default: {},
    },
    stripe: {
      type: Object,
      default: {},
    },
    razorpay: {
      type: Object,
      default: {},
    },
  },
  {
    minimize: false,
  }
);

PaymentsSchema.index({ userID: 1 });

export const Payment = model("payments", PaymentsSchema);
export const User = model("users", UserSchema);
