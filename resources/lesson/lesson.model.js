import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const LessonSchema = Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    subject: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    language: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    live: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
