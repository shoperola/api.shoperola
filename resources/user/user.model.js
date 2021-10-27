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
    location: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    stored_email:{type: String,default: ""},
    stored_password:{ type: String, default: ""},
    dispensebag:{type:String,enum:["Yes","No"]},
    dispensecharge:{type:String,enum:["Free","Paid"]},
    categories: [{ type: SchemaTypes.ObjectId, ref: "Category" }],
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
    cartID:{type:SchemaTypes.ObjectId,ref:'carts'}
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
