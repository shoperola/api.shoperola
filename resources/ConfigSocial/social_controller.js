import {ConfigSocial} from "./social_model";

const social_update = async(req,res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.body.id;
          const check = await ConfigSocial.findById(id);
          if(!check){
            const social = await ConfigSocial.create({...req.body,userID: req.user._id});
             return  res.status(202).json({message: "Created Social links",data:social});
              
          }
          const update = await ConfigSocial.findByIdAndUpdate(id,{$set: req.body},{new: true});
          console.log(update);
          res.status(200).json({success: "ok" , data: update});
    }catch(e){
        res.send(e);
    }
};

const view_social = async(req,res) => {
    try{
        const view_socail = await ConfigSocial.findOne({userID: req.user._id});
        res.status(200).json({success:"ok", data: view_socail});
    }catch(err){
        res.send(err);
    }
};

export { social_update, view_social};