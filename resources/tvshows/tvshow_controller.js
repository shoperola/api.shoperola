import { Tvshow } from "./tvshow_model.js";
import { Season } from "../season_model.js";
import { scheduleJob } from "node-schedule";

//constant for response
const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

const addtvshow = async (req, res) => {
  try {
    if (!req.user) {
      return res.send("User Not Found");
    }
    const show = await Tvshow.create({ ...req.body, user: req.user._id });
    const response = { ...defaultResponseObject, data: show };
    res.status(201).send(response);
  } catch (e) {
    const response = { ...defaultResponseObject, error: e, success: false };
    res.status(500).send(response);
  }
};

const edit_banner = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Tvshow.findById(id);
    if (!check) {
      res.send("add a title and plot");
    }
    console.log(req.files);
    const show = await Tvshow.findByIdAndUpdate(id, {
      thumbnail: `${
        req.files[0] && req.files[0].location ? req.files[0].location : ""
      }`,
      bannerimage: `${
        req.files[1] && req.files[1].location ? req.files[1].location : ""
      }`,
    });
    const response = { ...defaultResponseObject, data: show };
    res.send(response);
  } catch (e) {
    console.log(e);
    const response = { ...defaultResponseObject, error: e, success: false };
    res.status(500).send(response);
  }
};

const metadata = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Tvshow.findById(id);
    if (!check) {
      res.send("no data!!");
    }
    check.tvshow_flag = true;
    const metadata = await Tvshow.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(metadata);
    res.send(metadata);
  } catch (e) {
    res.status(500).send(e);
  }
};

const edit_season = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Tvshow.findById(id);
    if (!check) {
      res.send("no meta found");
    }
    const date = new Date(req.body.date);
    const season = await Season.create({ ...req.body });
    const job = scheduleJob(date, async () => {
      const edit = await Season.findByIdAndUpdate(
        season._id,
        { launch: true },
        { new: true }
      );
      console.log(edit);
      job.cancel();
    });
    check.season.push(season._id);
    check.save();
    res.send(season);
  } catch (e) {
    console.log(e);
    const response = { ...defaultResponseObject, error: e, success: false };
    res.status(500).send(response);
  }
};

const edit_video = async (req, res) => {
  try {
    console.log(req.params.id);
    const id = req.params.id;
    const check = await Season.findById(id);
    if (!check) {
      res.send("no season added");
    }
    const episode = { ...req.body, video: req.file.location };
    console.log(check);
    check.episode.push(episode);
    await check.save();

    res.send(episode);
  } catch (e) {
    res.status(500).send(e);
  }
};

const view_tvshow = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Tvshow.findById(id).populate("season").exec();
    res.send(check);
  } catch (e) {
    res.status(500).send(e);
  }
};

const delete_season = async (req, res) => {
  try {
    const id = req.params.sid;
    const check = await Season.findById(id);
    if (!check) {
      res.send("no season found");
    }
    const show = await Season.findByIdAndDelete(id);
    res.send(show);
  } catch (e) {
    res.status(500).send(e);
  }
};

const delete_tvshow = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Tvshow.findById(id);
    if (!check) {
      res.send("no tv shows found");
    }
    const show = await Tvshow.findByIdAndDelete(id);
    res.send(show);
  } catch (e) {
    res.status(500).send(e);
  }
};

const delete_episode = async (req, res) => {
  try {
    const id = req.params.sid;
    const check = await Season.findById(id);
    if (!check) {
      res.send("no season found");
    }
    const index = check.episode.findIndex(
      (x) => JSON.stringify(x._id) === JSON.stringify(req.params.eid)
    );
    check.episode.splice(index, 1);
    const show = check.save();

    res.send(`deleted successfully ${show}`);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const edit_episode = async (req, res) => {
  try {
    const id = req.params.sid;
    const check = await Season.findById(id);
    if (!check) {
      res.send("no season found");
    }
    const index = check.episode.findIndex(
      (x) => JSON.stringify(x._id) === JSON.stringify(req.params.eid)
    );
    (check.episode[index].bannerimage = `${
      req.files[0] && req.files[0].filename ? req.files[0].filename : ""
    }`),
      (check.episode[index].name = req.body.name),
      (check.episode[index].video = `${
        req.files[1] && req.files[1].filename ? req.files[1].filename : ""
      }`);

    const show = await check.save();
    res.send(show);
  } catch (e) {
    res.status(500).send(e);
  }
};

const edit_season_no = async (req, res) => {
  try {
    const id = req.params.sid;
    const check = await Season.findById(id);
    if (!check) {
      res.send("no season found");
    }
    const season = await Season.findByIdAndUpdate(id, { $set: req.body });
    res.send(season);
  } catch (e) {
    res.status(500).send(e);
  }
};

const viewall_tvshow = async (req, res) => {
  try {
    const show = await Tvshow.find({}).populate("season");
    res.json({ show });
  } catch (e) {
    res.status(500).send("something went wrong" + e);
  }
};

export {
  addtvshow,
  edit_banner,
  metadata,
  edit_season,
  edit_season_no,
  edit_video,
  view_tvshow,
  delete_season,
  delete_tvshow,
  delete_episode,
  edit_episode,
  viewall_tvshow,
};
