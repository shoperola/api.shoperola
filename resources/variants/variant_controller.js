import {Variants} from "./variant_model";

const add_variant = async(req,res) =>{
try {
    const id = req.params.id;
    const objects = {...req.body}
    // console.log(objects);
    const add = await Variants.insertMany([objects])
    console.log(add);
    res.send(add)
} catch (er) {
    console.log(er);
    res.status(400).json({message: er.message});
}
}

export {add_variant};