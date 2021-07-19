import { Tvshow } from "./tvshow_model";
import { Season } from "../season_model";
import { scheduleJob } from "node-schedule";
import axios from "axios";
import { SECRETS } from "../../util/config";

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

    const updateObject = {};
    req.files && req.files.thumbnail
      ? (updateObject.thumbnail = req.files.thumbnail[0].location)
      : null;

    req.files && req.files.bannerImage
      ? (updateObject.bannerimage = req.files.bannerImage[0].location)
      : null;

    const show = await Tvshow.findByIdAndUpdate(id, updateObject);
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
    console.log(req.file);
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
    console.log(e);
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
    console.log(check);
    console.log(req.files);
    const eid = req.params.eid;

    const updateObject = {};
    for (const [key, value] of Object.entries(req.body)) {
      updateObject[`episode.$.${key}`] = value;
    }

    req.files[0] && req.files[0].location
      ? (updateObject["episode.$.tvshow"] = req.files[0].location)
      : null;

    console.log(updateObject);
    const episode = await Season.findOneAndUpdate(
      { "episode._id": eid },
      { $set: updateObject },
      {
        new: true,
      }
    );
    console.log(episode);
    res.send(episode);
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
    console.log(check, req.body);
    const season = await Season.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
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

const view_season_id = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Season.findById(id);
    if (!check) {
      res.send("no season found");
    }
    res.send(check);
  } catch (e) {
    res.send(e.message);
  }
};

const view_season = async (req, res) => {
  try {
    const check = await Season.find({});
    res.send(check);
  } catch (e) {
    res.send(e.message);
  }
};

const tvShowLatest = async (req, res) => {
  try {
    const show = await Tvshow.find({})
      .sort({ createdAt: -1 })
      .populate("season");
    res.json({ show });
  } catch (e) {
    res.status(500).send("something went wrong" + e);
  }
};

const tvShowTrending = async (req, res) => {
  try {
    const show = await Tvshow.find({}).sort({ views: -1 }).populate("season");
    res.json({ show });
  } catch (e) {
    res.status(500).send("something went wrong" + e);
  }
};

const tvShowsViewsIncrement = async (req, res) => {
  try {
    const tvshow = await Tvshow.findById(req.params.id);
    tvshow.views = Number(tvshow.views) + 1;
    await tvshow.save();
    res.json({ status: "OK", data: tvshow });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error updating " });
  }
};

const searchTvShowImdb = async (req, res) => {
  //FullActor,Posters,Ratings,
  try {
    const id = req.params.id;
    const season_id = req.params.sid;
    const resp = await axios.get(
      `https://imdb-api.com/en/API/SeasonEpisodes/${SECRETS.imDb_key}/${id}/${season_id}`
    );
    res.json({ status: "OK", data: resp.data });
  } catch (e) {
    res.send(e);
  }
};

const searchSeriesImdb = async (req, res) => {
  try {
    const name = req.params.name;
    const resp = await axios.get(
      `https://imdb-api.com/en/API/SearchSeries/${SECRETS.imDb_key}/${name}`
    );
    res.json({ status: "OK", data: resp.data });
  } catch (e) {
    res.status(500).send(e);
  }
};

const search_tvshow = async (req, res) => {
  try {
    const movie = await Tvshow.find({
      $or: [
        { title: new RegExp(req.params.name, "gi") },
        { description: new RegExp(req.params.name, "gi") },
      ],
      user: req.user._id,
    });
    res.json({ status: "ok", data: movie });
  } catch (e) {
    res.status(500).send(e);
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
  view_season_id,
  view_season,
  tvShowLatest,
  tvShowsViewsIncrement,
  tvShowTrending,
  searchTvShowImdb,
  searchSeriesImdb,
  search_tvshow,
};
