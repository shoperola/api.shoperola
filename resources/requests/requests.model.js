import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const RequestSchema = Schema(
  {
    clientID: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    userID: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "replied"],
      default: "pending",
    },
    attachments: [
      {
        link: String,
        filename: String,
      },
    ],
    requestVideo: {
      type: String,
      default: "",
    },
    requestText: {
      type: String,
      required: true,
    },
    answerVideo: {
      type: String,
      default: "",
    },
    answerText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Request = model("requests", RequestSchema);
