import {Text} from "./text.model";

const getConfigText= async (req, res) => {
    try{
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    const TextId=req.params.id; 
    if(!TextId){
        res.status(400).json({message: "Id is required!"});
    }
    
    const doc= await Text.findById(TextId);
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
}



const getAllText= async(req, res) => {
    try{
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    const doc= await Text.find({userID: req.user._id});
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
};


const postconfigText= async (req, res) => {
    try{
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    const doc= await Text.create({...req.body,userID:req.user._id});
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message});
    }
};

const deleteText= async (req, res) => {
    try{
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
        const id= req.params.id;
        if(!id){
            res.status(400).json({message: "Id is required!"});
        }
    const doc= await Text.findByIdAndDelete(id);
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message});
    }
}

const updateText= async (req, res) => {
    try{
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    
        const id=req.params.id;
        if(!id){
            res.status(400).json({message: "Id is required!"});
        }
    const doc= await Text.findByIdAndUpdate(id,{$set:req.body},{new: true});
    res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message});
    }
}

export {getConfigText,postconfigText,getAllText,deleteText,updateText};