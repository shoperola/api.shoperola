import { Lesson } from "./lesson.model.js";

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
  console.log(banner, video, thumbnail);
  const lessonObject = {
    ...req.body,
    madeBy: req.user._id,
    video: video ? video[0].location : "",
    banner: banner ? banner[0].location : "",
    thumbnail: thumbnail ? thumbnail[0].location : "",
  };

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

export { createLesson, updateLesson };
