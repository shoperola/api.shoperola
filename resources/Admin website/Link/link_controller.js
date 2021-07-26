import {Link} from "./link_model";

const add_link = async (req, res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User not found" });

        }
        const add_link = await Link.create({...req.body})
        console.log(add_link);
        res.status(200).json({ status: "OK", data: add_link})
    }catch(err){
        res.send(err)
    }
};

const update_link = async(req, res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User not found"});

        }
        const id = req.params.id
        const check = await Link.findById(id);
        if(!check){
            res.status(404).json({ message: "no link found"});

        }
        const update_link = await Link.findByIdAndUpdate(id,{$set: req.body}, {new: true});
        console.log(update_link);
        res.status(200).json({status: "ok", data: update_link});
    }catch(e){
        res.send(e);
    }
};

const view_link = async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found"});

        }
        const view_link = await Link.find({})
        console.log(view_link);
        res.status(200).json({status:"ok",data: view_link});
    } catch (e) {
        res.send(e);
        
    }
};

const delete_link = async(req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found"});

        }
        const id = req.params.id
        const check = await Link.findById(id);
        if(!check){
            res.status(404).json({ message: "no link found"});

        }
        const remove_link = await Link.findByIdAndDelete(id);
        console.log(remove_link);
        res.status(200).json({status: "ok", data: remove_link});
    } catch (e) {
        res.send(e);
        
    }
};
export {add_link, update_link,view_link,delete_link};