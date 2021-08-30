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

const postconfigText= async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "User not Found" });
    }
    const title= req.body.title;
    const Addedon=req.body.date;
    const Text= req.body.text;
    try{
    const doc= await Text.create({title:title,Addedon:Addedon,Text:Text});
    res.json({ status: "OK", data: doc.Text });
    } catch (e) {
        console.log(e);
    }
}

export {getConfigText,postconfigText};