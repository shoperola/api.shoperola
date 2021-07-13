import { Ecommerce } from "./ecomerce_model";

const getProducts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const products = await Ecommerce.find({ });
    res.json({ status: "OK", data: products });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error getting products" });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const product = await Ecommerce.findById(id);
    console.log(product);
    res.json({ status: "OK", data: product });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error getting product" });
  }
};

const addProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const image = req.file;
    const updateObject = image
      ? { ...req.body, image: image.location }
      : req.body;
    const product = await Ecommerce.create(updateObject);
    res.json({ status: "OK", data: product });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error Creating Product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const image = req.file;
    const updateObject = image
      ? { ...req.body, image: image.location }
      : req.body;
    const product = await Ecommerce.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    res.json({ status: "OK", data: product });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id not required" });
    }
    await Ecommerce.findByIdAndDelete(id);
    res.json({ status: "OK", message: "Product Deleted Successfully" });
  } catch (e) {
    console.log(e.message);
    res.json({ message: "Error deleting product" });
  }
};

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
