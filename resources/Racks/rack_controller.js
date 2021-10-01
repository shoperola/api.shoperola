import {Rack} from "./rack_model";

const rackcreate=async (req, res) => {
  try{
    const object={...req.body};
    const rack=await Rack.create({object,userID: req.user._id});
    console.log(rack);
    res.json({status:'created',data:rack});
  }catch(e){
      res.json(e.message);
  }
}

const rackupdate=async (req, res) => {
  try{
    const rack=await Rack.find({userID: req.user._id},);
    console.log(rack);
    const updateObject={...req.body};const id=rack[0]._id
    const rackupdateObject= await Rack.findByIdAndUpdate(id,updateObject,{new: true});
    console.log(rack);
    res.json({status:'updated',data:rackupdateObject});
  }catch(e){
      res.json(e.message);
  }
}

const rackview=async (req, res) => {
  try{
    const rack=await Rack.find({userID: req.user._id},);
    console.log(rack);
  
    res.json({status:'updated',data:rack});
  }catch(e){
      res.json(e.message);
  }
}


export {rackcreate,rackupdate,rackview};