import {Coupon} from './coupon_model';

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

export {postcoupons,getcoupons,getcouponsbyid,updatecoupons,deletecoupons};




