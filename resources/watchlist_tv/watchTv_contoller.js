import {Tvwatchlist} from "./watchTv_model";
import { Client } from "../client/client.model";


const add_tvshow = async (req, res) => {
        
    const tvshowid = req.params.tid;
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      return res.status(400).json({ message: "User not Found" });
    }
    var watchData = {
      addedby: client._id,
      tvshow: [tvshowid]
    };
  
    Tvwatchlist.findOne({
      addedby: watchData.addedby,
    }, function (err, favorite) {
      if (err) throw err;
     else if (!favorite || favorite.length === 0) {
        Tvwatchlist.create(watchData, function (err, favores) {
          if (err) throw err;
          else{
          res.json({added : "Added to watch list!!"});
          }
        });
      } else {
        if (favorite.tvshow.indexOf(tvshowid) > -1) {
          res.json({already : "This is already in the watch list!" });
        } else {
          favorite.tvshow.push(tvshowid);
          favorite.save(function (err, favores) {
            if (err) throw err;
            else{
            res.json({ added : "Added to watch list!!" });
            }
          });
        }
      }
    });

    }