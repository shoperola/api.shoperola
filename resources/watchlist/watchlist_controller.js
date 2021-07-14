import {Watchlist} from "./watchlist_model";

const add_watchlist = async (req, res) => {
    try{
        
  const videoId = req.params.vid;

  var watchData = {
    addedby: req.params.userid,
    video: [videoId]
  };

  Watchlist.findOne({
    addedby: req.params.userid
  }, function (err, favorite) {
    if (err) throw err;
   else if (!favorite || favorite.length === 0) {
      Watchlist.create(watchData, function (err, favores) {
        if (err) throw err;
        else{
        res.json({added : "Added to watch list!!"});
        }
      });
    } else {
      if (favorite.video.indexOf(videoId) > -1) {
        res.json({already : "This is already in the watch list!" })
      } else {
        favorite.video.push(videoId);
        favorite.save(function (err, favores) {
          if (err) throw err;
          else{
          res.json({ added : "Added to watch list!!" });
          }
        });
      }
    }
  });

    }catch(e){
        res.send(e);
    }
};

const remove_watchlist = async (req, res) => {
    try{
        const id = req.params.vid
        console.log(id);
        const check = await Watchlist.find({addedby: req.body._id})
        console.log(check);
        if(!check){
          res.send('no videos found')
        }
        const remove = check[0].video.findIndex(x => JSON.stringify(x._id) === JSON.stringify(id))
        console.log(remove);
        if(remove === -1){
          res.send('eror')
        }
       const as = check[0].video.splice(remove,1);
       console.log(check[0].video);
        const show = await check[0].save();
        res.send("success");
        
      }catch(e){
        console.log(e);
        res.send(e)
      }
};

export {add_watchlist, remove_watchlist}