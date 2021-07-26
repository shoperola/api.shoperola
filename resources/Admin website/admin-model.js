import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";
import md5 from "md5";
import { SECRETS } from "../../util/config";

const AdminSchema = new Schema(
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

    bannerImage: {
      type: String,
      default:
        "https://sgp1.digitaloceanspaces.com/storage.tellytell.com/banner-default.png",
    },
  },
  { timestamps: true }
);

export const generateUniqueUserName = async (
  proposedName,
  firstName,
  lastName
) => {
  const doc = await Admin.findOne({ username: proposedName });
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

AdminSchema.pre("save", async function (next) {
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

AdminSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next) {
    const userID = this.getFilter()["_id"];
    console.log("DELETING USER", userID);
    //await Payment.findOneAndDelete({ userID });
    next();
  }
);

AdminSchema.methods.checkPassword = function (password) {
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

export const Admin = model("Admin", AdminSchema);
