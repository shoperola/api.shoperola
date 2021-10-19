import { Rack } from "./rack_model";
import { Cart } from "../Cart/cart_model";
import { Ecommerce } from "../Ecommerce/ecomerce_model";
const rackcreate = async (req, res) => {
  try {
    const object = { ...req.body };
    const rack = await Rack.create({ object, userID: req.user._id });
    console.log(rack);
    res.json({ status: "created", data: rack });
  } catch (e) {
    res.json(e.message);
  }
};

const rackupdate = async (req, res) => {
  try {
    const rack = await Rack.find({ userID: req.user._id });
    console.log(rack);
    const updateObject = { ...req.body };
    const id = rack[0]._id;
    const rackupdateObject = await Rack.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    console.log(rack);
    res.json({ status: "updated", data: rackupdateObject });
  } catch (e) {
    res.json(e.message);
  }
};

const rackview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not Found" });
    }
    const rack = await Rack.findOne({ userID: req.user._id });
    // .populate({path:"rack11",populate:{ path:'category'}})
    // .populate({path:"rack12",populate:{ path:'category'}})
    // .populate({path:"rack13",populate:{ path:'category'}})
    // .populate({path:"rack14",populate:{ path:'category'}})
    // .populate({path:"rack15",populate:{ path:'category'}})
    // .populate({path:"rack16",populate:{ path:'category'}})
    // .populate({path:"rack21",populate:{ path:'category'}})
    // .populate({path:"rack22",populate:{ path:'category'}})
    // .populate({path:"rack23",populate:{ path:'category'}})
    // .populate({path:"rack24",populate:{ path:'category'}})
    // .populate({path:"rack25",populate:{ path:'category'}})
    // .populate({path:"rack26",populate:{ path:'category'}})
    // .populate({path:"rack31",populate:{ path:'category'}})
    // .populate({path:"rack32",populate:{ path:'category'}})
    // .populate({path:"rack33",populate:{ path:'category'}})
    // .populate({path:"rack34",populate:{ path:'category'}})
    // .populate({path:"rack35",populate:{ path:'category'}})
    // .populate({path:"rack36",populate:{ path:'category'}})
    // .populate({path:"rack41",populate:{ path:'category'}})
    // .populate({path:"rack42",populate:{ path:'category'}})
    // .populate({path:"rack43",populate:{ path:'category'}})
    // .populate({path:"rack44",populate:{ path:'category'}})
    // .populate({path:"rack45",populate:{ path:'category'}})
    // .populate({path:"rack46",populate:{ path:'category'}})
    // .populate({path:"rack51",populate:{ path:'category'}})
    // .populate({path:"rack52",populate:{ path:'category'}})
    // .populate({path:"rack53",populate:{ path:'category'}})
    // .populate({path:"rack54",populate:{ path:'category'}})
    // .populate({path:"rack55",populate:{ path:'category'}})
    // .populate({path:"rack56",populate:{ path:'category'}})
    // .populate({path:"rack61",populate:{ path:'category'}})
    // .populate({path:"rack62",populate:{ path:'category'}})
    // .populate({path:"rack63",populate:{ path:'category'}})
    // .populate({path:"rack64",populate:{ path:'category'}})
    // .populate({path:"rack65",populate:{ path:'category'}})
    // .populate({path:"rack66",populate:{ path:'category'}})
    // .exec();
    res.json({ status: "OK", data: rack });
  } catch (e) {
    res.json(e.message);
  }
};

const rackdelete = async (req, res) => {
  try {
    const rack = await Rack.find({ userID: req.user._id });
    const rackname = req.body.rackname;
    console.log(rack[0]);
    if (rackname in rack[0]) {
      console.log("true");
    }
    // `rack[0].${rackname}` = " ";
    await rack[0].save();

    res.json({ status: "updated", data: rack });
  } catch (e) {
    res.json(e.message);
  }
};

const send_cart = async (req, res) => {
  try {
    const id = req.body.cartid;
    const cart = await Cart.findById(id);
    console.log(cart);
    const rack = await Rack.findById("6156e69be20cf65ae4ff26db");
    console.log(rack);

    let products = cart.products;
    let count=0;
    let countarr=[];
    // const pro=cart.products.map((product)=>{
      // });
      for (let i = 0; i < products.length; i++) {
      const ecom = await Ecommerce.findById(products[i].pid);
      count = products[i].quantity;
      console.log(count);
      console.log(products[i].pid);
      if (
        count > 0 &&
        (JSON.stringify(rack.rack11) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack11 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack12) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        count--;
        rack.rack12 = "615bf71e5cad360016111111";
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack13) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack13 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack14) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack14 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (count > 0 &&
        (JSON.stringify(rack.rack15) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack15 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (count > 0 &&
        (JSON.stringify(rack.rack16) === JSON.stringify(products[i].pid))
        ) {
        console.log("hello");
        rack.rack16 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack21) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack21 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack22) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack22 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack23) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack23 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack24) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack24 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack25) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack25 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (count > 0 &&
        (JSON.stringify(rack.rack26) === JSON.stringify(products[i].pid))
        ) {
        console.log("hello");
        rack.rack26 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack31) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack31 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack32) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack32 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack33) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack33 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack34) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack34 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack35) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack35 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack36) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack36 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack41) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack41 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack42) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack42 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack43) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack43 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
       ( JSON.stringify(rack.rack44) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack44 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack45) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack45 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack46) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack46 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack51) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack51 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack52) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack52 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack53) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack53 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
       ( JSON.stringify(rack.rack54) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack54 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack55) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack55 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack56) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack56 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        JSON.stringify(rack.rack61) === JSON.stringify(products[i].pid)
      ) {
        console.log("hello");
        rack.rack61 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        JSON.stringify(rack.rack62) === JSON.stringify(products[i].pid)
      ) {
        console.log("hello");
        rack.rack62 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack63) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack63 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack64) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack64 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack65) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack65 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if (
        count > 0 &&
        (JSON.stringify(rack.rack66) === JSON.stringify(products[i].pid))
      ) {
        console.log("hello");
        rack.rack66 = "615bf71e5cad360016111111";
        count--;
        await rack.save();
      }
      if(count<=0){
        res.send({status:"Product outofstock from rack",product:products[i].pid})
      }
      countarr.push(count);
    }
    res.json({ status: "updated", data: rack ,noofproductsnotinrack:countarr});
  } catch (e) {
    res.json(e.message);
  }
};

export { rackcreate, rackupdate, rackview, rackdelete, send_cart };
