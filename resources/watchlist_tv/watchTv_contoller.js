// import {Tvwatchlist} from "./watchTv_model";
// import { Client } from "../client/client.model";


// const add_tvshow = async (req, res) => {
        
//     const tvshowid = req.params.tid;
//     const client = await Client.findOne({ sub: req.user.sub });
//     if (!client) {
//       return res.status(400).json({ message: "User not Found" });
//     }
//     var watchData = {
//       addedby: client._id,
//       tvshow: [tvshowid]
//     };
  
//     Tvwatchlist.findOne({
//       addedby: watchData.addedby,
//     }, function (err, favorite) {
//       if (err) throw err;
//      else if (!favorite || favorite.length === 0) {
//         Tvwatchlist.create(watchData, function (err, favores) {
//           if (err) throw err;
//           else{
//           res.json({added : "Added to watch list!!"});
//           }
//         });
//       } else {
//         if (favorite.tvshow.indexOf(tvshowid) > -1) {
//           res.json({already : "This is already in the watch list!" });
//         } else {
//           favorite.tvshow.push(tvshowid);
//           favorite.save(function (err, favores) {
//             if (err) throw err;
//             else{
//             res.json({ added : "Added to watch list!!" });
//             }
//           });
//         }
//       }
//     });

//     };

// const remove_tvshow = async (req, res) => {
//     try{
//         const id = req.params.vid
//         console.log(id);
//         const client = await Client.findOne({ sub: req.user.sub });
//        if (!client) {
//         return res.status(400).json({ message: "User not Found" });
//     }
//         const check = await Tvwatchlist.find({addedby: client._id})
//         console.log(check);
//         if(!check){
//           res.send('no videos found')
//         }
//         // const x = (JSON.stringify(check[0].video) === JSON.stringify(id))
//         // console.log(x);
//         const remove = check[0].video.findIndex(x => JSON.stringify(x._id) === JSON.stringify(id))
//         console.log(remove);
//         if(remove === -1){
//           res.send('eror')
//         }
//        const as = check[0].video.splice(remove,1);
//        console.log(check[0].video);
//         const show = await check[0].save();
//         res.send("success");
        
//       }catch(e){
//         console.log(e);
//         res.send(e)
//       }
// }


// export {add_tvshow,remove_tvshow};