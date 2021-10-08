import { Cart } from "./cart_model";
import { Client } from "../client/client.model";
import { Ecommerce } from "../Ecommerce/ecomerce_model";
import { User } from "../user/user.model";
import { Coupon } from "../Coupons/coupon_model";
import { Shipping } from "../shipping_method/shipping_model";

const update_cart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    //  console.log(client);
    const id = req.body.productid;

    const product = await Ecommerce.findById(id);
    // console.log(product);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const check = await Cart.findById(req.user.cartID); //console.log(check.products);
    const index = check.products.findIndex((x) => x.pid == id);
    if(index>=0){
      return res.status(400).json({status:"Already in the cart",cart:check});
    }
    const quantity = await product.quantity;
    //console.log(quantity);
    const req_quantity = req.body.req_quantity;
    //console.log(req_quantity);
    // const userID=req.body.userID;
    if (req_quantity < quantity) {
      const cart = await Cart.findOneAndUpdate(
        { _id: req.user.cartID },
        {
          $addToSet: { products: { pid: id, quantity: req_quantity } },

          // $push: {quantity: req_quantity},
          //$inc: { total_price: (product.sale_price)*req_quantity },
        },
        { new: true }
      ).populate({
        path: "products",
        populate: {
          path: "pid",
        },
      });
      const remaining_quantity = (await quantity) - req_quantity;
      //console.log(remaining_quantity);
      const a = await product.updateOne({
        $set: { quantity: remaining_quantity },
      });
      let total_price = 0;
      cart.products.map((x) => {
        total_price += x.pid.total_price * x.quantity;
      });
      await cart.updateOne({ $set: { cart_total_price: total_price } });
      res.send(cart);
    } else if (req_quantity >= quantity) {
      res.status(400).json({ status: "out of stock!!!", stock: quantity });
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
    //console.log(client);
    //const cartId = req.body.id;
    //const userID = req.body.userID;
    const id = req.body.oid;
    const req_quantity = req.body.req_quantity;
    //const id = req.params.id;
    //console.log(req_quantity);
    const product = await Ecommerce.findById(req.params.id);
    console.log(product);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    
    let quantity = await product.quantity;
    let quantity2=quantity;
    //console.log(product);
    //console.log(quantity);
    const cart = await Cart.findById(req.user.cartID).populate({
      path: "products",
      populate: {
        path: "pid",
      },
    });
    const index = await cart.products.filter((x) => x._id == id);
    if(req_quantity<index[0].quantity){
    product.quantity+=index[0].quantity;
    await product.save();
  }
  quantity2= await product.quantity;

    if (req_quantity < quantity) {
      await cart.save();
      let total_price = 0;
      cart.products.map((x) => {
        total_price += x.pid.total_price * x.quantity;
      });
      await cart.updateOne({ $set: { cart_total_price: total_price } });
      const saved= await Cart.findById(req.user.cartID);
      if(req_quantity==index[0].quantity){
        return res.send({status:"Updated", cart:saved});
      }
      index[0].quantity = req_quantity;
      const remaining_quantity = quantity2 - req_quantity;
      console.log(remaining_quantity);
      const a = await product.updateOne({
        $set: { quantity: remaining_quantity },
      });
      console.log(a);

      res
        .status(200)
        .json({
          success: true,
          cart: saved,
          message: "quantity updated successfully",
        });
      
    } else if (req_quantity >= quantity) {
      res.status(400).json({status:"out of stock!!!", stock:quantity});
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
};

const view_cart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const check = await Cart.findById(req.user.cartID).populate({
      path: "products",
      populate: {
        path: "pid",
      },
    });
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
    const id = req.params.id;
    const product = await Ecommerce.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const check = await Cart.findById(req.user.cartID); //console.log(check.products);
    console.log(check);
    const index = check.products.findIndex((x) => x.pid == id);
    console.log(index);
    const quantity = await check.products[index].quantity;
    check.products.splice(index, 1);
    check.cart_total_price -= product.total_price * quantity;
    await check.save();
    res.status(200).json({ success: "sucess", data: check });
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
    const coupons = await Coupon.find({ coupon_code: req.body.code });
    if (!coupons) {
      res.status(404).json({ message: "no coupons" });
    }

    //console.log(coupons);
    if (Date.parse(coupons[0].end_date) > Date.parse(new Date())) {
      // for(let i of coupons){
      if (coupons[0].applies_to == "orders_over") {
        console.log("sfdsf");
        if (coupons[0].promotion == "amount_off") {
          let cart = await Cart.find({
            cart_total_price: { $gte: req.body.price },
          });
          cart = await cart.map((x) => {
            x.cart_total_price -= coupons[0].amount_off;
            return x;
          });
          const savecart = await cart.map((x) => x.save());
        } else if (coupons[0].promotion == "percentage_off") {
          let cart = await Cart.find({
            cart_total_price: { $gte: req.body.price },
          });
          cart = await cart.map(
            (x) =>
              x.cart_total_price -
              (x.cart_total_price * coupons[0].percentage_off) / 100
          );
          const savecart = await cart.map((x) => x.save());
        }
      } else if (coupons[0].applies_to == "single_product") {
        if (coupons[0].promotion == "amount_off") {
          let cart = await Cart.find({ "products.pid": req.query.id }).populate(
            "pid"
          );
          cart = await cart.map((x) => {
            x.cart_total_price -= coupons[0].amount_off;
            return x;
          });
          const savecart = await cart.map((x) => x.save());
        } else if (coupons[0].promotion == "percentage_off") {
          let cart = await Cart.find({ "products.pid": req.query.id }).populate(
            "pid"
          );
          cart = await cart.map((x) => {
            x.cart_total_price -=
              (x.cart_total_price * coupons[0].percentage_off) / 100;
            return x;
          });
          const savecart = await cart.map((x) => x.save());
        }
      } else if (coupons[0].applies_to == "product_by_category") {
        if (coupons[0].promotion == "amount_off") {
          const product = await Ecommerce.find({ category: req.query.id });
          const we = await product.map((x) => x._id);
          //console.log(we);
          let cart = await Cart.find({ "products.pid": we }).populate("pid");
          cart = await cart.map((x) => {
            x.cart_total_price -= coupons[0].amount_off;
            return x;
          });
          const savecart = await cart.map((x) => x.save());
        } else if (coupons[0].promotion == "percentage_off") {
          const product = await Ecommerce.find({ category: req.query.id });
          const we = await product.map((x) => x._id);
          let cart = await Cart.find({ "products.pid": we }).populate("pid");
          cart = await cart.map((x) => {
            x.cart_total_price -=
              (x.cart_total_price * coupons[0].percentage_off) / 100;
            return x;
          });
          const savecart = await cart.map((x) => x.save());
        }
      } else if (coupons[0].applies_to == "any_order") {
        if (coupons[0].promotion == "amount_off") {
          let cart = await Cart.find({}).populate("pid");
          cart = await cart.map((x) => {
            x.cart_total_price -= coupons[0].amount_off;
            return x;
          });
          const savecart = await cart.map((x) => x.save());
        } else if (coupons[0].promotion == "percentage_off") {
          const cart = await Cart.find({}).populate("pid");
          console.log(cart);
          const q = await cart.map((x) => {
            x.cart_total_price -=
              (x.cart_total_price * coupons[0].percentage_off) / 100;
            return x;
          });
          const savecart = await cart.map((x) => x.save());
          // await cart.save();
          // console.log(q);
        }
      } else if (coupons[0].applies_to == "free_shipping") {
        console.log("free_shipping");
      }

      //  }
      res.status(200).json({ message: "coupon applied successfully" });
    } else {
      for (let i of coupons) {
        coupons[0].status = "inactive";
        await coupons[0].save();
      }
      res.status(400).json({ message: "Coupon code Expired" });
    }
    // const products = await Cart.find({cart_total_price:{$gte: req.body.price}});
    // const q = await products.map(x => x.cart_total_price - coupons[0].amount_off);
    // console.log(q);
    // res.status(200).json({ products: products});
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "something went wrong" });
  }
};

export {
  update_cart,
  view_cart,
  remove_product,
  update_quantity,
  get_product_by_price,
};
