//import {Orders} from "./Orders.model";
import { Client } from "../client/client.model";
import { Address } from "../Address/address_model";
import { Orders } from "../orders/order_model";
import {Ecommerce} from "../Ecommerce/ecomerce_model";
import {Cart } from "../Cart/cart_model";

const show_order = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const view_order = await Orders.find({ user: req.user._id })
      .populate("products")
      .populate("address");
    console.log(view_order);
    // const see_order = await view_order.filter(x => x.success === true);
    res.send(view_order);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const update_order = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const updateObject = { ...req.body };
    const orderid = req.body.id;
    const view_order = await Orders.findByIdAndUpdate(
      orderid,
      { $set: updateObject },
      { new: true }
    );

    res.send(view_order);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const view_order = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const view_order = await Orders.find({ user: req.user._id });
    const view_cart= await Cart.find({});
    console.log(view_order);
    const Productsview= await Ecommerce.find({});
    const Productsidarray=[];
    const prod=Productsview.map(x=>Productsidarray.push(x._id));
    console.log("Prod id "+ Productsidarray);
    const total_orders = view_order.length;
    let total_sales = 0;
    const least_sold_products=[];
    const most_sold_products = [];
    const maporders= view_order.map((x) => {
      total_sales += x.amount;
    });
    const carts= view_cart.map((x)=>{
        const mapids = x.products.map((some) => {
          const mapss = Productsidarray.map((pro) => {
            if (JSON.stringify(pro) === JSON.stringify(some.pid)) {
              if (!most_sold_products.includes(pro))
                   most_sold_products.push(pro);
            }else if (JSON.stringify(pro) !== JSON.stringify(some.pid)) {
              if(!least_sold_products.includes(pro))
              least_sold_products.push(pro);
            }
          });
        });
      });
      console.log("Most sold " + most_sold_products);
      console.log("Least sold " +least_sold_products);

    res.json({
      status: "OK",
      total_orders: total_orders,
      total_sales: total_sales,
      Least_sold_products:least_sold_products,
      Most_sold_products:most_sold_products,
      data: view_order,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
const view_order_byid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "params id not found!!!" });
    }
    const view_order = await Orders.findById(id)
      .populate({
        path: "products",
        populate: { path: "tax", select: "tax_percentage" },
      })
      .populate("address")
      .populate({ path: "client", select: "email" });

    res.send(view_order);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
const order_by_id = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      res.status(404).json({ message: "no client found!!!" });
    }
    const view_order = await Orders.findById(req.params.id)
      .populate("products")
      .populate("address");
    res.send(view_order);
  } catch (err) {
    res.send(err.message);
  }
};

const update_address = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      res.status(404).json({ message: "no client found!!!" });
    }
    const aid = req.body.aid;
    const id = req.params.id;
    const search_address = await Address.findById(aid);
    console.log(search_address);
    if (!search_address) {
      res.status(404).json({ message: "no address found!!!" });
    }
    const update_Orderss = await Orders.findByIdAndUpdate(
      id,
      { address: aid },
      { new: true }
    );
    console.log(update_Orderss);
    res.send(update_Orderss);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "something went wrong!" });
  }
};

export {
  show_order,
  order_by_id,
  update_address,
  update_order,
  view_order,
  view_order_byid,
};
