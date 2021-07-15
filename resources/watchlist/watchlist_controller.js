import { Watchlist } from "./watchlist_model";
import { Client } from "../client/client.model";

const add_watchlist = async (req, res) => {
  try {
    const videoId = req.params.vid;
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      return res.status(400).json({ message: "User not Found" });
    }
    var watchData = {
      addedby: client._id,
      video: [videoId],
    };

    const watchlist = await Watchlist.findByIdAndUpdate(
      client.watchlist,
      {
        $addToSet: {
          video: videoId,
        },
      },
      {
        new: true,
      }
    );

    res.json({ status: "OK", data: watchlist });
  } catch (e) {
    res.send(e);
  }
};

const remove_watchlist = async (req, res) => {
  try {
    const id = req.params.vid;
    console.log(id);
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      return res.status(400).json({ message: "User not Found" });
    }
    const check = await Watchlist.find({ addedby: client._id });
    console.log(check);
    if (!check) {
      res.send("no videos found");
    }

    const remove = check[0].video.findIndex(
      (x) => JSON.stringify(x._id) === JSON.stringify(id)
    );
    console.log(remove);
    if (remove === -1) {
      res.send("eror");
    }
    const as = check[0].video.splice(remove, 1);
    console.log(check[0].video);
    const show = await check[0].save();
    res.send("success");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const viewWatchlist = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      return res.status(400).json({ message: "User not Found" });
    }
    const view = await Watchlist.find({}).populate("video");
    res.send(view);
  } catch (e) {
    res.send(e);
  }
};

export { add_watchlist, remove_watchlist, viewWatchlist };
