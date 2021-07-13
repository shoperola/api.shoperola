import { Studio } from "./studio_model";

const add_product = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const product = await Studio.create({
      duration: req.body.time,
      product: req.body.productid,
      current_time: req.body.current_time,
    });
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
    const userID = req.body.userID;
    const view = await Studio.find({ userID }).populate("product");
    res.status(200).send({ data: view });
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
    const check = await Studio.findById(id).populate("product");
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
