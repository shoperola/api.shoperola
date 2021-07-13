import {Cart} from "./cart_model";
import {Client} from "../client/client.model";

const update_cart = async (req, res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User Not Found" });
        }
        const client = await Client.findOne({ sub: req.user.sub });
        
        const cart = await Cart.findByIdAndUpdate(client.cartid,{$addToSet: {products: req.body.productid}} ,{new:true});
        res.send(cart)
    }catch(e){
        res.send(e)
    }
};

const view_cart = async (req, res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User Not Found" });
        }
        const client = await Client.findOne({ sub: req.user.sub });
        const check = await Cart.findOne({})
        res.status(200).send(check) 
    }catch(e){
        res.send(e);
    }
};

const remove_product = async (req, res) => {
    try{
        if(!req.user){
            return res.status(400).json({ message: "User Not Found" });
        }
        const client = await Client.findOne({ sub: req.user.sub });
    
    const id = req.params.id;
    const remove = await Cart.findByIdAndUpdate(client.cartid,{$pull: {products: id}});
    res.send(remove);
    }catch(e){
        res.send(e)
    }

};


export {update_cart,view_cart,remove_product}

