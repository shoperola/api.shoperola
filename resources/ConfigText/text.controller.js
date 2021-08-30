import {Text} from "./text.model";

const getConfigText= async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    const TextId=req.body.id;
    try{
    const doc= await Text.findById(TextId);
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
    }
}

const getAllText= async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    try{
    const doc= await Text.find({userID: req.user._id});
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
    }
}


const postconfigText= async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    try{
    const doc= await Text.create({...req.body,userID:req.user._id});
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message});
    }
}

const deleteText= async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    try{
    const doc= await Text.create({...req.body,userID:req.user._id});
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message});
    }
}

export {getConfigText,postconfigText,getAllText};