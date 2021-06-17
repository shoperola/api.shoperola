import { Lesson } from "./lesson.model.js";

const createLesson = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { title, subject, language } = req.body;
  if (!title || !subject || !language) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  const lessonObject = req.file
    ? { ...req.body, video: req.file.location }
    : req.body;

  try {
    const doc = await Lesson.create(lessonObject);
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error creating lesson" });
  }
};

export { createLesson };
