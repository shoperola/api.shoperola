import {Social} from "./social_model";

const social_add = async(req,res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
        const social = await Social.create({...req.body});
        console.log(social);
        res.status(201).json({success: "ok", data: social});

    }catch(e){
        res.send(e);
    }
};

const social_update = async(req,res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.params.id;
          const check = await Social.findById(id);
          if(!check){
              res.status(404).json({message: "no social link found"});
          }
          const update = await Social.findByIdAndUpdate(id,{$set: req.body},{new: true});
          console.log(update);
          res.status(200).json({success: "ok" , data: update});
    }catch(e){
        res.send(e);
    }
};

const view_social = async(req,res) => {
    try{
        const view_socail = await Social.find({});
        res.status(200).json({success:"ok", data: view_socail});
    }catch(err){
        res.send(err);
    }
};

const social_delete = async(req,res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User Not Found" })
        }
        const id = req.params.id
        const check = await Social.findById(id);
        if(!check){
            res.status(404).json({ message: "Social link not available"});
        }
        const remove = await Social.findByIdAndDelete(id);
        res.status(200).json({success:"ok", data: remove});
    }catch(err){
        res.send(err);
    }
};
export {social_add, social_update, view_social, social_delete};