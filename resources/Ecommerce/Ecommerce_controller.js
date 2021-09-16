import { Ecommerce } from "./ecomerce_model";
import {Tax} from '../tax_rates/tax_model';
// import {Variants} from '../variants/variant_model';

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
   // console.log(req.files, req.body);
  // console.log("pplpl");
    let variantArray=[];
    const flag=req.body.flag;
    console.log(flag);
      value=req.body.value;
      options=req.body.options;
      //let variant;
    const {image,image1,image2,image3,image4,image5} = req.files;
    const name = await Tax.find({tax_name: 'ZERO_TAX'});
    //variant = await Variants.create({});
    const updateObject ={ ...req.body,variants: variantArray,options:options,value:value,userID: req.user._id };
    image ? (updateObject.image = image[0].location) : null;
    image1 ? (updateObject.image1 = image1[0].location) : null;
    image2 ? (updateObject.image2 = image2[0].location) : null;
    image3 ? (updateObject.image3 = image3[0].location) : null;
    image4 ? (updateObject.image4 = image4[0].location) : null;
    image5 ? (updateObject.image5 = image5[0].location) : null;
  
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
    let value,options;
    const flag= req.body.flag;
    if(flag){
      console.log("JHKJASKDGH");  
        value=req.body.value;
        options=req.body.options;
    }
    const {image,image1,image2,image3,image4,image5} = req.files;
    const name = await Tax.find({tax_name: 'ZERO_TAX'});
      const updateObject ={ ...req.body};
      image ? (updateObject.image = image[0].location) : null;
      image1 ? (updateObject.image1 = image1[0].location) : null; 
      image2 ? (updateObject.image2 = image2[0].location) : null;
      image3 ? (updateObject.image3 = image3[0].location) : null;
      image4 ? (updateObject.image4 = image4[0].location) : null;
      image5 ? (updateObject.image5 = image5[0].location) : null;
    const product = await Ecommerce.findByIdAndUpdate(id, {updateObject,$addToset:{options:options,value:value}}, {
      new: true});
      const view = await product.populate("tax",async(err,res)=>{
        console.log(res);
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
   console.log('Product updated');
    console.log(product);
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
};

const add_variant = async (req, res) => {
  try {
    let variantArray=[];
        const variantData={...req.body,variant_image:req.file.location};
        variantArray.push(variantData);
        console.log(variantArray);
    const ID= req.body.id;
    const product= await Ecommerce.findByIdAndUpdate(ID, {$addToSet:{variants: variantArray}},{new: true});
    console.log(product);
    res.status(200).json({message: 'success', data: product});
    
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'something went wrong'});
  }
}
const update_variant = async (req, res) => {
  try {
    const vid=req.params.id;
    const ID= req.body.id;
    const product= await Ecommerce.findById(ID);
    const variant=product.variants.filter(x=>x._id==vid);
    variant[0].variant_price=req.body.variant_price;
    variant[0].variant_quantity=req.body.variant_quantity;
    variant[0].variant=req.body.variant;
    variant[0].variant_image=req.file.location;
    console.log(variant);
    await product.save();
    res.status(200).json({message: 'success', data: variant});
    
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'something went wrong'});
  }
}

const delete_variant= async (req, res) => {
  try {
    const vid=req.params.id;
    const ID= req.body.id;
    const product= await Ecommerce.findById(ID);
    console.log(product);
    // const variant=product.variants.filter(x=>x._id==vid);
    await product.variants.pull({_id:vid});
    await product.save();
    res.status(200).json({message: 'success', data: product});
    
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'something went wrong'});
  }
}

const view_variant= async (req, res) => {
  try {
    const ID= req.body.id;
    const product= await Ecommerce.findById(ID);

    res.status(200).json({message: 'success', data: product.variants});
    
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
  count_product,
  add_variant,
  delete_variant,
  update_variant,
  view_variant
};
