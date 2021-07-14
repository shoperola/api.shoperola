import { Studio } from "./studio_model";

const add_product = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    const productid = req.body.productid;
    const current_time = req.body.current_time;
    const updateObject = {
      ...req.body,
      productid: undefined,
      current_time: undefined,
    };
    const product = await Studio.findByIdAndUpdate(id, {
      $addToSet: {
        current_time: current_time,
        products: productid,
      },
      $set: updateObject,
    }).populate("products");
    console.log(product);
    res.status(201).send(product);
  } catch (e) {
    res.send(e);
  }
};

const view_list = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const view = await Studio.find({}).populate("product");
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
    const check = await Studio.findById(id);
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
