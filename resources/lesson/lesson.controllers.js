import { Lesson } from "./lesson.model.js";
import { scheduleJob } from "node-schedule";

const getLessons = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const doc = await Lesson.find({ madeBy: req.user._id })
      .sort({ updatedAt: -1 })
      .populate({ path: "subject", select: "-addedBy -__v" })
      .populate({ path: "language", select: "name" })
      .exec();
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error getting requests", error: e.message });
  }
};

const getLesson = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Lesson id required" });
  }
  try {
    const doc = await Lesson.findById(id)
      .populate({ path: "subject", select: "-addedBy -__v" })
      .populate({ path: "language", select: "name" });
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error getting Lesson", error: e.message });
  }
};

const createLesson = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { title, subject, language } = req.body;
  if (!title || !subject || !language) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  // console.log(req.files.banner[0]);
  const { banner, video, thumbnail } = req.files;
  console.log(banner, video, thumbnail);
  const lessonObject = {
    ...req.body,
    madeBy: req.user._id,
    video: video ? video[0].location : "",
    banner: banner ? banner[0].location : "",
    thumbnail: thumbnail ? thumbnail[0].location : "",
  };

  try {
    let doc = await Lesson.create(lessonObject);
    doc = await Lesson.findById(doc)
      .populate({ path: "subject", select: "-addedBy -__v" })
      .populate({ path: "language", select: "name" });
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error creating lesson" });
  }
};

const updateLesson = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Lesson id not provided" });
  }
  const { banner, video, thumbnail } = req.files;
  const { launchDate } = req.body;
  console.log(banner, video, thumbnail);
  const lessonObject = req.body;
  video ? (lessonObject.video = video[0].location) : null;
  banner ? (lessonObject.banner = banner[0].location) : null;
  thumbnail ? (lessonObject.thumbnail = thumbnail[0].location) : null;

  // schedule a job for the given launchDate if launchdate is provided
  if (launchDate) {
    try {
      const job = scheduleJob(launchDate, async () => {
        const doc = await Lesson.findByIdAndUpdate(id, { live: true });
        console.log(`Video:id(${doc._id}) is live`);
      });
    } catch (e) {
      console.log(e.message);
      res
        .status(500)
        .json({ message: "Error scheduling job", error: e.message });
    }
  }

  try {
    const doc = await Lesson.findOneAndUpdate({ _id: id }, lessonObject, {
      new: true,
    })
      .populate({ path: "subject", select: "-addedBy -__v" })
      .populate({ path: "language", select: "name" });
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error updating lesson", error: e.message });
  }
};

const deleteLesson = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Lesson id not provided" });
  }
  try {
    await Lesson.findByIdAndDelete(id);
    res.json({ status: "OK", message: "Lesson Deleted Successfully" });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error deleting lesson", error: e.message });
  }
};
export { getLesson, getLessons, createLesson, updateLesson, deleteLesson };
