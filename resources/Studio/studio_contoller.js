import { Studio } from "./studio_model";
import mongoose from "mongoose";
const { Types } = mongoose;

const add_product = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    console.log(req.file);
    const updateObject = {
      ...req.body
    };
    console.log(updateObject);

    // console.log(id, productid, current_time, updateObject);
    const product = await Studio.findByIdAndUpdate(
      id,
      {
      $push:{updateObject}
        
      },
      { new: true }
    ).populate("products");
    // const product = await Studio.findById(Types.ObjectId(id));
    // console.log(product);
    res.status(201).send(product);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};

const view_list = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const view = await Studio.find({}).populate("products");
    res.status(200).send({ view });
  } catch (e) {
    res.send(e);
  }
};

const view_listbyid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id not found" });
    }
    const check = await Studio.findById(id).populate("products");
    res.status(200).send(check);
  } catch (e) {
    res.send(e);
  }
};

const delete_product = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id not found" });
    }
    const productid = req.query.productid;

    const studio = await Studio.findById(id).populate("products");
    console.log(studio.products);
    const index = studio.products.findIndex(x => x._id == productid);
    console.log(studio.products, index);
    studio.products.splice(index,1)
    studio.duration.splice(index,1)
    studio.current_time.splice(index,1)
    studio.url.splice(index,1)
    studio.CTA.splice(index,1)
  
   const saved = await studio.save();
   //console.log(saved);
    res.status(200).json({saved})
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

export { add_product, delete_product, view_list, view_listbyid };
