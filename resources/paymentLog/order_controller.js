//import {Orders} from "./Orders.model";
import { Client } from "../client/client.model";
import {Address} from "../Address/address_model";
import { Orders} from "../orders/order_model";

const show_order = async(req,res) => {
    try{
        const client = await Client.findOne({ sub: req.user.sub });
        if(!client){
            res.status(404).json({message: "no client found!!!"})
        }
          const view_order = await Orders.find({client: client._id}).populate("products").populate("address");
        // const see_order = await view_order.filter(x => x.success === true);
         res.send(view_order)
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
};


const order_by_id = async(req, res) => {
    try{
        const client = await Client.findOne({ sub: req.user.sub });
        if(!client){
            res.status(404).json({message: "no client found!!!"})
        }
          const view_order = await Orders.findById(req.params.id).populate("products").populate("address");
          res.send(view_order);

    }catch(err){
        res.send(err.message);
    }
};

const update_address = async (req, res) => {
    try{
        const client = await Client.findOne({ sub: req.user.sub });
        if(!client){
            res.status(404).json({message: "no client found!!!"})
        }
        const aid = req.body.aid;
        const id = req.params.id;
        const search_address = await Address.findById(aid);
        console.log(search_address);
        if(!search_address){
            res.status(404).json({message: "no address found!!!"});
        }
        const update_Orderss = await Orders.findByIdAndUpdate(id,{address: aid}, {new: true});
        console.log(update_Orderss);
        res.send(update_Orderss);
        
    }catch(e){
        console.log(e);
        res.status(404).json({message:"something went wrong!"});
    }
}

export { show_order, order_by_id, update_address};