import {Coupon} from './coupon_model';
import {Client} from '../client/client.model';
const postcoupons= async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not Found" });
        }

        const createObject= {...req.body,userID: req.user._id};
        
        const doc= await Coupon.create(createObject);
        
        res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
}
const getcoupons= async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not Found" });
        }
        const doc= await Coupon.find({userID: req.user._id});
        res.json({data:doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
}
const getcouponsbyid= async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not Found" });
        }
        const id= req.params.id;
        const doc= await Coupon.findById(id);
        res.json({data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
}
const updatecoupons= async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not Found" });
        }
        const id = req.params.id;
        const updateObject= {...req.body};
        const doc= await Coupon.findByIdAndUpdate(id,updateObject,{new: true});
        res.json({ status: "OK", data: doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
}
const deletecoupons= async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not Found" });
        }
        const id= req.params.id;
        const doc= await Coupon.findByIdAndDelete(id);
        res.json({ status: "OK", message:"Coupon Deleted Successfully"});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
}

const getcoupons_client= async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not Found" });
        
        }
        //const client = await Client.findOne({ sub: req.user.sub });

        const doc= await Coupon.find({userID: req.body.id});
        res.json({data:doc});
    } catch (e) {
        console.log(e);
        res.status(400).json({message:e.message})
    }
}

const is_used = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not Found" });
        
        }
        const id = req.params.id;
        const client = await Client.find({_id: req.body.clientid});
        console.log(client[0].coupons_used);
        const is_used = await Coupon.findByIdAndUpdate(id, {$set: req.body}, {new: true});
        if(is_used.is_used == true){
            await client[0].coupons_used.push(id);
            const saved = await client[0].save();
        }
        res.status(200).json({message:"coupon used one time", data: saved});
    } catch (err) {
        console.log(err);
        res.status(400).json({message:err.message})
    }
}
export {postcoupons,getcoupons,getcouponsbyid,updatecoupons,deletecoupons,getcoupons_client,is_used};



