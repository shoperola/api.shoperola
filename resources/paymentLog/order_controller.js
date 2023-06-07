//import {Orders} from "./Orders.model";
import { Client } from "../client/client.model";
import { Address } from "../Address/address_model";
import { Orders } from "../orders/order_model";
import { Ecommerce } from "../Ecommerce/ecomerce_model";
import { Cart } from "../Cart/cart_model";
import { OrderBeforeConfirm } from "../orders/order_before_confirm.model";
import Razorpay from "razorpay";
import axios from "axios";
import crypto from "crypto";
import { generateID } from "../../util/generateID";

// Razorpay setup
// const instance = new Razorpay({
//   key_id: process.env.RAZOR_PAY_KEY_ID,
//   key_secret: process.env.RAZOR_PAY_KEY_SECRET,
// });
const config = {
  key_id: "rzp_test_MgNn5wEsqPADa4",
  key_secret: "2e0TiXHTcHs252qDrcXUHOaQ",
};
const instance = new Razorpay({
  key_id: "rzp_test_MgNn5wEsqPADa4",
  key_secret: "2e0TiXHTcHs252qDrcXUHOaQ",
});

// create orders
const create_order = async (req, res) => {
  try {
    const { _id, title, description, price, qty, image } = req.body;
    const userId = req.user._id;

    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const findUserId = await OrderBeforeConfirm.find({ userID: userId });
    if (findUserId.length > 0) {
      const order_confirm_prod = await OrderBeforeConfirm.findOne(
        { userID: userId },
        { product: { $elemMatch: { productId: _id } } }
      );

      if (order_confirm_prod && order_confirm_prod.product.length) {
        res.status(201).json({ message: "product already exist!" });
      } else {
        const pushProduct = await OrderBeforeConfirm.findOneAndUpdate(
          {
            userID: userId,
          },
          {
            $push: {
              product: {
                productId: _id,
                title: title,
                description: description,
                price: price,
                qty: qty,
                image: image,
              },
            },
          }
        );

        await pushProduct.save();
      }
    } else {
      const productObj = new OrderBeforeConfirm({
        userID: userId,
        product: [
          {
            productId: _id,
            title: title,
            description: description,
            price: price,
            qty: qty,
            image: image,
          },
        ],
      });

      await productObj.save();

      res.status(201).json({ message: "product added successfully!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

// fetch order_confirm_product
const fetchOrderConfirmProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const findProduct = await OrderBeforeConfirm.findOne({ userID: userId });
    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove product
const removeProductOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const findProduct = await OrderBeforeConfirm.updateOne(
      { userID: userId },
      { $pull: { product: { productId } } }
    );

    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update product
const updateProductOrderById = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user._id;
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const findProduct = await OrderBeforeConfirm.findOne(
      { userID: userId },
      { product: { $elemMatch: { productId } } }
    );

    findProduct.product[0].qty += qty;

    await findProduct.save();

    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------Create Order Pay-----------------------
const createOrderPayProduct = async (req, res) => {
  try {
    const { totalPrice, totalQty, data } = req.body;

    // add GST
    const calGST = (totalPrice * 5) / 100;
    const GSTPrice = totalPrice + calGST;

    // Create Order using  in numeric format
    const order_id = generateID();

    const userId = req.user._id;
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const product = data.map((prod) => {
      const resp = {
        productId: prod.productId,
        title: prod.title,
        description: prod.description,
        price: prod.price,
        qty: prod.qty,
        image: prod.image,
      };
      return resp;
    });

    const instObj = new Orders({
      userID: userId,
      totalPrice: totalPrice,
      totalQuantity: totalQty,
      product: product,
      GSTPrice: GSTPrice,
      order_id: order_id,
    });
    const respData = await instObj.save();
    if (respData) {
      await OrderBeforeConfirm.updateOne(
        { userID: userId },
        { $set: { product: [] } }
      );
    }

    res.status(201).json(respData);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

// fetch order
const fetchOrderPay = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const findProduct = await Orders.find({ userID: userId });
    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// fetch order by ID
const fetchOrderPayById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const findProduct = await Orders.findOne({ order_id: orderId });
    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//====================Payment or Checkout============================

const checkoutOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderProduct = await Orders.findOne({ order_id: orderId });

    const { GSTPrice, totalPrice, _id } = orderProduct;

    const options = {
      amount: GSTPrice * 100,
      currency: "INR",
      receipt: `receipt${_id}`,
      payment_capture: 0,
    };
    instance.orders.create(options, async function (err, order) {
      if (err) {
        // console.log(err);
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
      return res.status(200).json(order);
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};
// payment create
const paymentCreateOrder = async (req, res) => {
  try {
    const { response } = req.body;

    const { orderId } = req.query;
    const orderProduct = await Orders.findOne({ order_id: orderId });
    const { GSTPrice, totalPrice } = orderProduct;

    const url = `https://${config.key_id}:${config.key_secret}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`;
    const { data: respOrder } = await axios.post(url, {
      amount: GSTPrice * 100,
      currency: "INR",
    });

    if (respOrder.status === "captured") {
      orderProduct.status = "PAID";
      orderProduct.razorpay_order_id = response.razorpay_order_id;
      orderProduct.razorpay_payment_id = response.razorpay_payment_id;

      await orderProduct.save();
      res.send(respOrder);
    } else {
      return res.status(500).send({
        message: "Payment Failed",
      });
    }
  } catch (err) {
    console.log("error", err);
    return res.status(500).send({
      message: "Something Went Wrong",
    });
  }
};

// old controller js

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
    const view_cart = await Cart.find({});

    console.log(view_order);
    const Productsview = await Ecommerce.find({});
    const Productsidarray = [];

    const prod = Productsview.map((x) => Productsidarray.push(x._id));

    console.log("Prod id " + Productsidarray);
    const total_orders = view_order.length;
    let total_sales = 0;
    const least_sold_products = [];
    const most_sold_products = [];
    const maporders = view_order.map((x) => {
      total_sales += x.amount;
    });
    const carts = view_cart.map((x) => {
      const mapids = x.products.map((some) => {
        const mapss = Productsidarray.map((pro) => {
          const productsales = some.quantity;
          if (JSON.stringify(pro) === JSON.stringify(some.pid)) {
            if (
              !most_sold_products.some((od) => {
                if (
                  od.pro === pro &&
                  od.date === x.createdAt &&
                  od.total_sales === productsales
                )
                  return true;
              })
            )
              most_sold_products.push({
                pro: pro,
                date: x.createdAt,
                total_sales: productsales,
              });
          } else if (JSON.stringify(pro) !== JSON.stringify(some.pid)) {
            if (
              !least_sold_products.some((od) => {
                if (
                  od.pro === pro &&
                  od.date === x.createdAt &&
                  od.total_sales === 0
                )
                  return true;
              })
            )
              least_sold_products.push({
                pro: pro,
                date: x.createdAt,
                total_sales: 0,
              });
          }
        });
      });
    });
    console.log("Most sold " + most_sold_products);
    console.log("Least sold " + least_sold_products);

    res.status(200).json({
      status: "OK",
      total_orders: total_orders,
      total_sales: total_sales,
      Least_sold_products: least_sold_products,
      Most_sold_products: most_sold_products,
      data: view_order,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
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
  create_order,
  fetchOrderConfirmProduct,
  updateProductOrderById,
  removeProductOrderById,
  createOrderPayProduct,
  fetchOrderPay,
  fetchOrderPayById,
  checkoutOrder,
  paymentCreateOrder,
};
