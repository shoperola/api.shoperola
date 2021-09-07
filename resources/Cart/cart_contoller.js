import { Cart } from "./cart_model";
import { Client } from "../client/client.model";
import { Ecommerce } from "../Ecommerce/ecomerce_model";
import {User} from "../user/user.model";
import {Coupon} from "../Coupons/coupon_model";
import {Shipping} from "../shipping_method/shipping_model";

const update_cart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const client = await Client.findOne({ sub: req.user.sub });
  //  console.log(client);
    const id = req.body.productid;
    // const userID = req.body.userid;
    // const adminId = await User.findById(userID);
    // if(!adminId){
    //   return res.status(400).json({message: "no admin found!!"});
    // }
    const product = await Ecommerce.findById(id);
   // console.log(product);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const quantity = await product.quantity
    //console.log(quantity);
    const req_quantity = req.body.req_quantity
    //console.log(req_quantity);
    const userID=req.body.userID;
    if(req_quantity < quantity){
       const cart = await Cart.findOneAndUpdate(
      {_id:client.cartid},
      {
        $addToSet: { products: {pid: id, quantity: req_quantity,userID:userID}},
        
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
      return console.log("out of stock!!!");
      
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
    //const cartId = req.body.id;
    //const userID = req.body.userID;
    const id = req.body.oid;
    const req_quantity = req.body.req_quantity
    //const id = req.params.id;
    //console.log(req_quantity);
    const product = await Ecommerce.findById(req.params.pid);
    //console.log(product);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const quantity = await product.quantity;
    //console.log(product);
    //console.log(quantity);
     if(req_quantity < quantity){
       const cart = await Cart.findById(client.cartid).populate({path:"products",populate: {
        path:'pid'}});
       const index = await cart.products.filter(x => x._id == id);
      index[0].quantity = req_quantity;
       const saved = await cart.save();
       let total_price = 0;
       cart.products.map(x => {total_price += x.pid.total_price* x.quantity});
      await cart.updateOne({$set:{cart_total_price:total_price}});
      //  console.log(cart);
    //   {_id: cartId},
    //   {
    //     // "products.$.quantity": req_quantity,
    //     $addToSet: { products: {quantity: req_quantity,userID:userID}},

    //     //$inc: { total_price: (product.sale_price)*req_quantity },  
    //   }
    // ).populate({path:"products",populate: {
    //   path: 'pid'}});
    //   console.log(cart);
    //res.send(cart)
    
    const remaining_quantity = await quantity - req_quantity;
    console.log(remaining_quantity);
    const a = await product.updateOne({$set: {quantity: remaining_quantity}});
    console.log(a);

    res.status(200).json({success: true, message: "quantity updated successfully"});
    } 
    else if(req_quantity >= quantity){
      console.log("out of stock!!!");
    }

  
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
    check.cart_total_price -= product.total_price* quantity;
     await check.save();
    res.status(200).json({success: "sucess",data: check});
  } catch (e) {
    res.send(e);
  }
};

const get_product_by_price = async (req, res) => {
  try {
    // if (!req.user) {
    //   return res.status(400).json({ message: "User Not Found" });
    // }
    // const client = await Client.findOne({ sub: req.user.sub });
    const coupons = await Coupon.find({coupon_code: req.body.code});
    if(!coupons){
      res.status(404).json({ message: "no coupons"});
    }
    console.log(coupons);
    // for(let i of coupons){
      if(coupons[0].applies_to == 'orders_over'){
        console.log("sfdsf");
        if(coupons[0].promotion == 'amount_off'){
          let cart = await Cart.find({cart_total_price:{$gte: req.body.price}});
          cart = await cart.map(x =>{ x.cart_total_price -= coupons[0].amount_off;return x;});
          const savecart= await cart.map(x=> x.save());

        }
        else if(coupons[0].promotion == 'percentage_off'){
        
          let cart = await Cart.find({cart_total_price:{$gte: req.body.price}});
          cart = await cart.map(x => x.cart_total_price - (x.cart_total_price * coupons[0].percentage_off)/100);
          const savecart= await cart.map(x=> x.save());

        }

      }

      else if(coupons[0].applies_to == 'single_product'){
        if(coupons[0].promotion == 'amount_off'){
          let cart = await Cart.find({"products.pid": req.query.id}).populate("pid");
          cart = await cart.map(x => {x.cart_total_price -= coupons[0].amount_off;return x;});
          const savecart= await cart.map(x=> x.save());

        }
        else if(coupons[0].promotion == 'percentage_off'){
        
          let cart = await Cart.find({"products.pid": req.query.id}).populate("pid");
          cart = await cart.map(x => {x.cart_total_price -= (x.cart_total_price * coupons[0].percentage_off)/100;return x;});
          const savecart= await cart.map(x=> x.save());

        }
      }

      else if(coupons[0].applies_to == 'product_by_category'){
        if(coupons[0].promotion == 'amount_off'){
          const product = await Ecommerce.find({category: req.query.id});
          const we = await product.map(x => x._id);
          //console.log(we);
        let cart = await Cart.find({"products.pid": we}).populate("pid");
        cart = await cart.map(x => {x.cart_total_price -= coupons[0].amount_off;return x;});
        const savecart= await cart.map(x=> x.save());

        
        }
        else if(coupons[0].promotion == 'percentage_off'){
          const product = await Ecommerce.find({category: req.query.id});
          const we = await product.map(x => x._id);
          let cart = await Cart.find({"products.pid": we}).populate("pid");
          cart = await cart.map(x => {x.cart_total_price -= (x.cart_total_price * coupons[0].percentage_off)/100;return x;});
          const savecart= await cart.map(x=> x.save());
        }
      }

      else if(coupons[0].applies_to == 'any_order'){
        if(coupons[0].promotion == 'amount_off'){
        let cart = await Cart.find({}).populate("pid");
        cart = await cart.map(x => {x.cart_total_price-= coupons[0].amount_off;return x;});
        const savecart= await cart.map(x=> x.save());
        
        }
        else if(coupons[0].promotion == 'percentage_off'){
          const cart = await Cart.find({}).populate("pid");
          console.log(cart);
          const q = await cart.map(x => {x.cart_total_price -= (x.cart_total_price * coupons[0].percentage_off)/100;  return x;});
          const savecart= await cart.map(x=> x.save());
          // await cart.save();
          // console.log(q);
        }
      }

  //  }
    res.status(200).json({message: 'coupon applied successfully'});
    // const products = await Cart.find({cart_total_price:{$gte: req.body.price}});
    // const q = await products.map(x => x.cart_total_price - coupons[0].amount_off);
    // console.log(q);
    // res.status(200).json({ products: products});
  } catch (err) {
    console.log(err);
    res.status(400).json({message: 'something went wrong'});
  }
}


export { update_cart, view_cart, remove_product , update_quantity,get_product_by_price};
