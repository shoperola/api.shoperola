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

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") && !this.isModified("username")) {
    return next();
  }
  try {
    this.username = `${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}`;
  } catch (e) {
    console.log(e.message);
    this.username = `${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}.${md5(
      [this.firstName, this.lastName, Date.now()]
    )}`;
  }

  this.publicUrl = `https://konsult-member.com/${this.username}`;

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

UserSchema.pre("remove", function (next) {
  Payment.deleteOne({ userID: this._id });
  next();
});
