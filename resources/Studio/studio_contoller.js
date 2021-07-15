import { Studio } from "./studio_model";
import mongoose from "mongoose";
const { Types } = mongoose;

const add_product = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;

    const updateObject = {
      ...req.body,
      userID: req.user._id,
    };

    // console.log(id, productid, current_time, updateObject);
    const product = await Studio.findByIdAndUpdate(
      id,
      {
        $addToSet: updateObject,
      },
      { new: true }
    ).populate("products");
    // const product = await Studio.findById(Types.ObjectId(id));
    console.log(product);
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
    const check = await Studio.findByIdAndDelete(id);
    res.status(200).send(check);
  } catch (e) {
    res.send(e);
  }
};

export { add_product, delete_product, view_list, view_listbyid };
