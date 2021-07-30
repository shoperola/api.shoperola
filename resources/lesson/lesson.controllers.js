import axios from "axios";
import { Lesson } from "./lesson.model";
import { scheduleJob } from "node-schedule";
import { SECRETS } from "../../util/config";
import { Studio } from "../Studio/studio_model";

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
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Lesson id required" });
    }
    const doc = await Lesson.findById(id);
    console.log(doc);
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error getting Lesson", error: e.message });
  }
};

const createLesson = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const thumbnail = req.file;
  const { title, languageid } = req.body;
  if (!title || !languageid) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  const studio = await Studio.create({});
  const lessonObject = {
    ...req.body,
    thumbnail: thumbnail.location,
    madeBy: req.user._id,
    studio_id: studio._id,
  };

  try {
    let doc = await Lesson.create(lessonObject);
    doc = await Lesson.findById(doc).populate({
      path: "languageid",
      select: "name",
    });
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
  const {banner,video, thumbnail } = req.files;
  const { launchDate } = req.body;
 // console.log(banner, video, thumbnail);
  const lessonObject = req.body;
  video ? (lessonObject.video = video[0].location) : null;
  banner ? (lessonObject.banner = banner[0].location) : null;
  thumbnail ? (lessonObject.thumbnail = thumbnail[0].location) : null;

  // schedule a job for the given launchDate if launchdate is provided
  if (launchDate) {
    try {
      const job = scheduleJob(launchDate, async () => {
        const doc = await Lesson.findByIdAndUpdate(id, { launch_flag: true });
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
    }).populate({ path: "language", select: "name" });
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

const suspendLesson = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "video Id not provided" });
    }
    const lesson = await Lesson.findByIdAndUpdate(id, { live: false });
    res.json({ status: "OK", data: lesson });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error Suspending video", e: e.message });
  }
};

const makeliveLesson = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "video Id not provided" });
    }
    const lesson = await Lesson.findByIdAndUpdate(id, { live: true });
    res.json({ status: "OK", data: lesson });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error Suspending video", e: e.message });
  }
};

const imdb_searchmovie = async (req, res) => {
  try {
    const name = req.params.name;
    if (!name) return res.status(400).json({ message: "Name not provided" });
    const api_key = SECRETS.imDb_key;
    const resp = await axios.get(
      `https://imdb-api.com/en/API/SearchMovie/${api_key}/${name}`
    );
    console.log(resp);
    res.send(resp.data);
    
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};

const imdb_searchbyid = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Id not provided" });
    const api_key = SECRETS.imDb_key;
    const resp = await axios.get(
      `https://imdb-api.com/en/API/Title/${api_key}/${id}/Ratings`
    );
    res.send(resp.data);
  } catch (e) {
    res.status(500).send(e);
  }
};

const metadata = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Lesson.findById(id);
    if (!check) {
      res.status(400).send("something went wrong");
    }
    console.log(check);
    console.log(req.body);
    const video = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
    console.log(video);
    res.send(video);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getVideo = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Lesson.findById(id);
    if (!check) {
      return res.status(404).send("no video found");
    }
    console.log(check.video);
    res.json({ video: check.video, studio_id: check.studio_id });
  } catch (e) {
    res.status(500).send(e);
  }
};

const trending = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const doc = await Lesson.find({ madeBy: req.user._id })
      .sort({ views: -1 })
      .limit(4)
      .exec();
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error getting requests", error: e.message });
  }
};

const videosViewsIncrement = async (req, res) => {
  try {
    const video = await Lesson.findById(req.params.id);
    video.views = Number(video.views) + 1;
    await video.save();
    res.json({ status: "OK", data: video });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error updating " });
  }
};
// const search_movies = async (req, res) => {
//   try {
//     const movie = await Lesson.find({
//       $or: [
//         { title: new RegExp(req.params.name, "gi") },
//         { plot_show: new RegExp(req.params.name, "gi") },
//       ],
//       madeBy: req.user._id,
//     });
//     res.json({ status: "ok", data: movie });
//   } catch (e) {
//     res.status(500).send(e);
//   }
// };
export {
  getLesson,
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  imdb_searchmovie,
  imdb_searchbyid,
  metadata,
  getVideo,
  suspendLesson,
  trending,
  videosViewsIncrement,
  //search_movies,
  makeliveLesson,
};
