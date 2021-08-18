import { Cart } from "./cart_model";
import { Client } from "../client/client.model";
import { Ecommerce } from "../Ecommerce/ecomerce_model";

const update_cart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const client = await Client.findOne({ sub: req.user.sub });
  //  console.log(client);
    const id = req.body.productid;
    const product = await Ecommerce.findById(id);
   // console.log(product);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const quantity = await product.quantity
    //console.log(quantity);
    const req_quantity = req.body.req_quantity
    //console.log(req_quantity);
    if(req_quantity < quantity){
       const cart = await Cart.findOneAndUpdate(
      {_id:client.cartid},
      {
        $addToSet: { products: {pid: id, quantity: req_quantity}},
       // $push: {quantity: req_quantity},
        //$inc: { total_price: (product.sale_price)*req_quantity },  
      },
      { new: true }
    ).populate({path:"products",populate: {
      path: 'pid'}});
    const remaining_quantity = await quantity - req_quantity;
    //console.log(remaining_quantity);
    const a = await product.updateOne({$set: {quantity: remaining_quantity}});
    //console.log(a);
    
    //console.log("////" + cart)
    res.send(cart);

   }
    else if (req_quantity >= quantity){
      console.log("out of stock!!!");
    }
  } catch (e) {
    res.send(e);
  }
};
const update_quantity = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const client = await Client.findOne({ sub: req.user.sub });
    //console.log(client);
    const id = req.body.id;
    const req_quantity = req.body.req_quantity
    //console.log(req_quantity);
    const product = await Ecommerce.findById(req.params.pid);
    //console.log(product);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const quantity = await product.quantity
    //console.log(quantity);
    //if(req_quantity < quantity){
       const cart = await Cart.findOneAndUpdate(
      {"products._id": id},
      {
        "products.$.quantity": req_quantity,
        //$inc: { total_price: (product.sale_price)*req_quantity },  
      },
      { new: true }
    ).populate({path:"products",populate: {
      path: 'pid'}});
    res.send(cart)
    
    // const remaining_quantity = await quantity - req_quantity;
    // console.log(remaining_quantity);
    // const a = await product.updateOne({$set: {quantity: remaining_quantity}});
    // console.log(a);
    // } 
    // else if (req_quantity >= quantity){
    //   console.log("out of stock!!!");
    // }
  }catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message});
  };
}

const view_cart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const client = await Client.findOne({ sub: req.user.sub });
    const check = await Cart.findById(client.cartid).populate({path:"products",populate: {
      path: 'pid'}});
    res.status(200).send(check);
  } catch (e) {
    res.send(e);
  }
};

const remove_product = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const client = await Client.findOne({ sub: req.user.sub });
    const id = req.params.id;
    const product = await Ecommerce.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const check = await Cart.findById(client.cartid)  //console.log(check.products);
      console.log(check);
    const index = check.products.findIndex(x => x.pid == id);
    console.log(index);
    const quantity = await check.products[index].quantity;
    check.products.splice(index, 1);
    check.cart_total_price -= product.sale_price* quantity;
     await check.save();
    res.status(200).json({success: "sucess",data: check});
  } catch (e) {
    res.send(e);
  }
};

export { update_cart, view_cart, remove_product , update_quantity};
