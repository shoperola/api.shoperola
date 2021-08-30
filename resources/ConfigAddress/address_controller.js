import {UserAddress} from "./address_model";

const add_Address = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const add_Address = await UserAddress.create({...req.body,userID: req.user._id});
          res.status(201).json({success: "ok", data: add_Address});

    }catch(e){
        res.send(e);
    }
};

const update_Address = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const doc= await UserAddress.findById(req.params.id);
        if(!doc){
              res.status(400).json({ message: "Something went wrong" });
        }
        const update = await UserAddress.findByIdAndUpdate(req.params.id,{$set: req.body}, {new: true});
        console.log(update);
        res.status(200).json({success: "ok", data: update});
    }catch(e){
        res.send(e);
        res.status(400).json({message:e.message});
    }
};

const view_Address = async(req,res) => {
    try{
        const view = await UserAddress.find({userID:req.user._id})
        res.status(200).json({success: "ok", data:view});
    }catch(e){
        res.send(e);
    }
};

const delete_Address = async(req,res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User Not Found" });
        }
        const check = await UserAddress.findById(req.params.id);
        if(!check){
        res.status(400).send("something went wrong");
        }
        const remove = await UserAddress.findByIdAndDelete(req.params.id);
        console.log(remove);
        res.status(200).json({success: "ok", data: remove});
         
    }catch(e){
        res.send(e);
    }
};
export {add_Address, update_Address, view_Address, delete_Address};