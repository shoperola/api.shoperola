import lodash from "lodash";

import { Orders } from "../orders/order_model";
import franchiseProductModel from "./franchise.model";

// Controller for creating an alert
const createProduct = async (req, res) => {
  try {
    const model = req.model;

    const { userId, productId, qty } = req.body;

    // find product with product id
    const findProduct = await model.findById(productId);
    if (findProduct.qty < qty) {
      res.status(404).json({ message: "product qty is not available!" });
    } else {
      const findUserId = await franchiseProductModel.find({ userID: userId });

      if (findUserId.length > 0) {
        const findFranchiseProduct = await franchiseProductModel.findOne(
          { userID: userId },
          { product: { $elemMatch: { productId } } }
        );

        if (findFranchiseProduct && findFranchiseProduct.product.length > 0) {
          findFranchiseProduct.product[0].qty += qty;

          await findFranchiseProduct.save();
          findProduct.qty -= qty;
          await findProduct.save();

          res.status(201).json({ message: "product added successfully!" });
        } else {
          const { _id, title, description, price, image } = findProduct;

          const pushProduct = await franchiseProductModel.findOneAndUpdate(
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
        const { _id, title, description, price, image } = findProduct;

        const productObj = new franchiseProductModel({
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
        findProduct.qty -= qty;
        await findProduct.save();

        res.status(201).json({ message: "product added successfully!" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all alerts
const getAllProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const findAllOrdreDelivered = await franchiseProductModel.find({
      userID: userId,
    });
    if (findAllOrdreDelivered) {
      res.status(200).json(findAllOrdreDelivered);
    } else {
      res.status(401).json("no data found");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a single alert by id
const getProductById = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      res.status(500).json({ message: "userId not found" });
    }
    const { productId } = req.body;
    const product = await franchiseProductModel.find({
      userID: userId,
      productId: productId,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for updating an alert by id
const updateProductById = async (req, res) => {
  try {
    const model = req.model;
    const { id, userId, qty } = req.body;
    const findProduct = await model.findOne({ _id: id });
    const product = await franchiseProductModel.findOne(
      { userID: userId },
      { product: { $elemMatch: { productId: id } } }
    );

    product.product[0].qty += qty;
    await product.save();

    findProduct.qty -= qty;
    await findProduct.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting an alert by id

const deleteAlertById = async (req, res) => {
  try {
    const alert = await franchiseProductModel.findByIdAndDelete(req.params.id);

    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteAlertById,
};
