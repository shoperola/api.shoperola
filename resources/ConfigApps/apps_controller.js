import {Apps} from "./apps_model";

const putapps = async (req, res) => {
 try{

    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
  const {androidapp,splashscreen} = req.files;
  const appsObject = {...req.body, userID: req.user._id};
  console.log(appsObject);
    androidapp ? (appsObject.androidapp = androidapp[0].location) : null;
    splashscreen ? (appsObject.splashscreen = splashscreen[0].location) : null;
  const id= req.body.id;
  const check=await Apps.findById(id); 
  if(!check){
      const newapps= await Apps.create(appsObject);
      return res.json({ status: "OK", data: newapps });
  }
  const updateapps= await Apps.findByIdAndUpdate(id,{$set: appsObject}, {new: true});
  res.json({ status: "OK", data: updateapps });
}catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error updating apps", error: e.message });
  }

}


const getapps = async (req, res) => {
    try{
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const apps= await Apps.findOne({userID: req.user._id});
    res.json({ status: "OK", data: apps });
}catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error getting apps", error: e.message });
  }

}

export {putapps,getapps};