import {Variants} from "./variant_model";

const add_variant = async(req,res) =>{
try {
    if (!req.user) {
        return res.status(400).json({ message: "User Not Found" });
      }
    // const files=req.files;
    console.log(req.files.map(x=>x.location));
    const files=req.files.map(x=>x.location);
    const objects = {...req.body,variant_image:files,userID: req.user._id}
    // console.log(objects);

    const add = await Variants.insertMany([objects]);
    console.log(add);
    res.send(add)
} catch (er) {
    console.log(er);
    res.status(400).json({message: er.message});
}
}

const update_variant = async(req,res) =>{
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
        const id = req.params.id;
        // const files=req.files;
        // console.log(req.files.map(x=>x.location));
        const files=req.files.map(x=>x.location);
        const objects = {...req.body,variant_image:files}
        // console.log(objects);
        console.log(id);
        const add = await Variants.updateMany({_id:id},{$set:objects});
        console.log(add);
        res.send(add)
    } catch (er) {
        console.log(er);
        res.status(400).json({message: er.message});
    }
    }

    const view_variant = async(req,res) =>{
        try {
            if (!req.user) {
                return res.status(400).json({ message: "User Not Found" });
              }
            // const files=req.files;
            // console.log(req.files.map(x=>x.location));
            const add = await Variants.find({userID: req.user._id});
            console.log(add);
            res.send(add)
        } catch (er) {
            console.log(er);
            res.status(400).json({message: er.message});
        }
        }
export {add_variant,update_variant,view_variant};