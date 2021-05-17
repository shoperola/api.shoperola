import { Schema, SchemaTypes, model } from "mongoose";

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
      type: Boolean,
      enum: ["pending", "replied"],
      default: "pending",
    },
    attachments: [],
    video: {
      type: String,
    },
    requestText: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true }
);
