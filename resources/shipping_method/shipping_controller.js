import {Shipping} from "./shipping_model";

const add_shipment = async(req,res) => {
    try {
        if(!req.user){
            res.status(400).json({message: "no user found!!"});
        }
        const add_shipment = await Shipping.create({...req.body, userID: req.user._id});
        res.status(201).json({success: "success", data: add_shipment});
        
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "something went wrong!!"});
    }
};

const view_shipments = async(req, res) => {
    try {
        if(!req.user){
            res.status(400).json({message: "no user found!!"});
        }
        const view_shipments = await Shipping.find({userID: req.user._id});
        res.status(200).json({success: "success", data: view_shipments});
        
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "something went wrong"});
    }
};
const view_shipment = async(req, res) => {
    try {
        if(!req.user){
            res.status(400).json({message: "no user found!!"});
        }
        const id = req.params.id
        if(!id){
            res.status(404).json({message: "no id found!!"});
        }
        const view_shipment = await Shipping.findById(id);
        res.status(200).json({success: true, data: view_shipment});
    } catch (err) {
        console.log(err);
        res.status(400).json({message: "something went wrong"});
    }
};
const update_shipment = async(req, res) => {
    try {
        if(!req.user){
            res.status(400).json({message: "no user found!!"});
        }
        const id = req.params.id
        if(!id){
            res.status(404).json({message: "no id found!!"});
        }
        const update_shipment = await Shipping.findByIdAndUpdate(id,{$set: req.body}, {new: true});
        res.status(200).json({success: true, data: update_shipment});
        
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "something went wrong"});
    }
};
const delete_shipment = async(req, res) => {
    try {
        if(!req.user){
            res.status(400).json({message: "no user found!!"});
        }
        const id = req.params.id
        if(!id){
            res.status(404).json({message: "no id found!!"});
        }
        const delete_shipment = await Shipping.findByIdAndDelete(id);
        res.status(200).json({success: true, data: delete_shipment});
        
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "something went wrong"});
        
    }
};

const change_status = async(req,res) => {
 try {
    if (!req.user) {
        return res.status(400).json({ message: "User Not Found" });
      }
      const id = req.params.id;
      const check = await Shipping.findById(id);
      if(!check){
          res.status(404).json({ message: "no shipment found!!"});
      }
      if(check.status === 'active'){
          check.status = 'inactive'
          await check.save();

      }
     else if(check.status === 'inactive'){
        check.status = 'active'
        await check.save();
     }
     res.status(200).json({success:true, data:check});

 } catch (e) {
     console.log(e);
     res.status(400).json({message: "something went wrong"});
 }
    
};

const zero_shipping_rate = async(req, res) => {
    try {
        const add_shipping_zero_tax = await Shipping.create({...req.body});
        res.status(201).json({success: true, data: add_shipping_zero_tax});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "something went wrong"});
    } 
}
export{add_shipment, view_shipments, view_shipment, update_shipment, delete_shipment, change_status,zero_shipping_rate};