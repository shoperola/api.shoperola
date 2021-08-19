import { Ecommerce } from "./ecomerce_model";
import {Tax} from '../tax_rates/tax_model';


const getProducts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const products = await Ecommerce.find({userID: req.user._id}).populate("tax");
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

const getproducy_by_category = async(req,res) => {
  try{
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }
  const product = await Ecommerce.find({category: id})
  console.log(product);
  res.json({ status: "OK", data: product });
} catch (e) {
  console.log(e.message);
  res.status(400).json({ message: "Error getting product" });
}
}

const addProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    console.log(req.file, req.body);
    const image = req.file;
    const name = await Tax.find({tax_name: 'ZERO_TAX'});
    const updateObject = image
      ? { ...req.body, image: image.location, userID: req.user._id }
      : { ...req.body, userID: req.user._id };
    const product = await Ecommerce.create(updateObject);
    const view = await product.populate("tax", async(err,res) => {
      if(res.tax._id == name[0]._id){
        const total_price_zero = res.sale_price;
        const saved = await Ecommerce.findOneAndUpdate({_id:product._id},{$set: {total_price:total_price_zero}},{new: true});
       console.log(`zero % - ${saved}`);
      }
      const tax_amount = ((res.sale_price)*res.tax.tax_percentage)/(100+res.tax.tax_percentage);
      const total_price = Math.trunc(res.sale_price + tax_amount);
      const saved = await Ecommerce.findOneAndUpdate({_id:product._id},{$set: {total_price:total_price}},{new: true});
      console.log(`with tax % - ${saved}`);
    });
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
      new: true}).populate("category").populate("tax");
    //console.log(product);
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

const  count_product = async (req, res) => {
  try {
    const tax_id = req.params.id;
    const s = JSON.stringify(tax_id);
     const tax_flag = req.body.flag;
    const count = await Ecommerce.find({tax: tax_id}).populate("tax");

    const name = await Tax.find({tax_name: 'ZERO_TAX'});
    //console.log(name[0]._id);
    if(tax_flag) {
      for(var i of count) {
        i.tax = name[0]._id;
        const saved = await i.save();
        console.log(saved);
      }
      await Tax.findByIdAndDelete(tax_id);
    }
    res.status(200).json({message: 'success', data: count.length});
    
  } catch (e) { 
    console.log(e);
    res.status(400).json({message: 'something went wrong'});
  }
}

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getproducy_by_category,
  count_product
};
