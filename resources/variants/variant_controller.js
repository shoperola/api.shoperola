import {Variants} from "./variant_model";
import {Tax} from "../tax_rates/tax_model";

const add_variant = async(req,res) =>{
try {
    if (!req.user) {
        return res.status(400).json({ message: "User Not Found" });
      }
    // const files=req.files;
   // console.log(req.files.map(x=>x.location));
    const files=req.files.map(x=>x.location);
    const objects = {...req.body,variant_image:files,userID: req.user._id}
    const zero_tax = await Tax.find({tax_name: 'ZERO_TAX'});
    //console.log(zero_tax);
    // console.log(objects);
    const add = await Variants.insertMany(objects);
    //console.log(add);
    const add_variants = await add[0].populate("tax").execPopulate();
    console.log(add_variants);
    for(var i of add) {
        console.log(i);
        const price = i.variant_price;
        const quantity = i.variant_quantity;
       const tax_value  = i.tax.tax_percentage;
        //console.log(tax_value);
       // const tax_price = ((price)*tax_value)/(100 + tax_value));
        var sum = 0;
        var tax_price = 0
        var total_price = 0
        for(var i=0; i< price.length; i++) {
             tax_price = ((price[i]*tax_value)/(100 + tax_value));  
             total_price = Math.trunc(price[i] + tax_price)
           sum = total_price*quantity[i];
           console.log(sum)
}
    }
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