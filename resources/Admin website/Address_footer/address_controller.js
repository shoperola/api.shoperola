import {AdminAddress} from "./address_model";

const add_AdminAddress = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const createObject = { ...req.body,adminID: req.user._id}
          const add_AdminAddress = await AdminAddress.create(createObject);
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
        const check = await AdminAddress.find({adminID: req.user._id});
        if(!check){
            res.status(400).send("something went wrong");
        }
        const id = check[0]._id;
        const remove = await AdminAddress.findByIdAndUpdate(id,{$set: req.body}, {new: true});
        console.log(remove);
        res.status(200).json({success: "ok", data: remove});
    }catch(e){
        res.send(e)
    }
};

const view_AdminAddress = async(req,res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User Not Found" });
        }
        const view = await AdminAddress.find({adminID: req.user._id})
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
        const check = await AdminAddress.find({adminID: req.user._id});
        if(!check){
            res.status(400).send("something went wrong");
        }
        const id = check[0]._id;
        const remove = await AdminAddress.findByIdAndDelete(id);
        console.log(remove);
        res.status(200).json({success: "ok", data: remove});
         
    }catch(e){
        res.send(e);
    }
};
export {add_AdminAddress, update_AdminAddress, view_AdminAddress, delete_AdminAddress};