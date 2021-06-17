import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const LessonSchema = Schema(
  {
    madeBy: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    subject: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "subjects",
    },
    language: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "languages",
    },
    live: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    launchDate: {
      type: Date,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Lesson = model("lessons", LessonSchema);
