import {AdminAddress} from "./address_model";

const add_AdminAddress = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const add_AdminAddress = await AdminAddress.create({...req.body});
          res.status(201).json({success: "ok", data: add_AdminAddress});

    }catch(e){
        res.send(e);
    }
};

const update_AdminAddress = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const id = req.params.id
        const check = await AdminAddress.findById(id);
        if(!check){
            res.status(400).send("something went wrong");
        }
        const remove = await AdminAddress.findByIdAndUpdate(id,{$set: req.body}, {new: true});
        console.log(remove);
        res.status(200).json({success: "ok", data: remove});
    }catch(e){
        res.send(e)
    }
};

const view_AdminAddress = async(req,res) => {
    try{
        const view = await AdminAddress.find({})
        res.status(200).json({success: "ok", data:view});
    }catch(e){
        res.send(e);
    }
};

const delete_AdminAddress = async(req,res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User Not Found" });
        }
        const id = req.params.id;
        const check = await AdminAddress.findById(id);
        if(!check){
            res.status(400).send("something went wrong");
        }
        const remove = await AdminAddress.findByIdAndDelete(id);
        console.log(remove);
        res.status(200).json({success: "ok", data: remove});
         
    }catch(e){
        res.send(e);
    }
};
export {add_AdminAddress, update_AdminAddress, view_AdminAddress, delete_AdminAddress};