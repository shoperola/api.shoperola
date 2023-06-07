import Alert from "../AlertStock/alert.model";
import vendingMachineModel from "./vending.model";

// Controller for creating an alert
const createProduct = async (req, res) => {
  try {
    const model = req.model;

    const { userId, productId, qty } = req.body;

    // find product with product id

    // const findProduct = await model.findById(productId);

    const findProduct = await model.findOne(
      { userID: userId },
      { product: { $elemMatch: { productId } } }
    );

    if (findProduct.qty < qty) {
      res.status(404).json({ message: "product qty is not available!" });
    } else {
      const findUserId = await vendingMachineModel.find({ userID: userId });

      if (findUserId.length > 0) {
        const findFranchiseProduct = await vendingMachineModel.findOne(
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
          const { productId, title, description, price, image } =
            findProduct.product[0];

          const pushProduct = await vendingMachineModel.findOneAndUpdate(
            {
              userID: userId,
            },
            {
              $push: {
                product: {
                  productId: productId,
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
        const { productId, title, description, price, image } =
          findProduct.product[0];

        const productObj = new vendingMachineModel({
          userID: userId,
          product: [
            {
              productId: productId,
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
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all alerts
const getAllProduct = async (req, res) => {
  try {
    const product = await vendingMachineModel.find({
      userID: req.body.userId,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a single alert by id
const getProductById = async (req, res) => {
  try {
    const { userId, id } = req.body;
    const product = await vendingMachineModel.findOne(
      { userID: userId },
      { product: { $elemMatch: { productId: id } } }
    );
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

    const findProduct = await model.findOne(
      { userID: userId },
      { product: { $elemMatch: { productId: id } } }
    );

    const product = await vendingMachineModel.findOne(
      { userID: userId },
      { product: { $elemMatch: { productId: id } } }
    );

    product.product[0].qty += qty;
    await product.save();

    // Alert

    if (product.product[0].qty !== 0) {
      await Alert.findOneAndDelete({
        productName: product.product[0].title,
      });
    }

    findProduct.product[0].qty -= qty;
    await findProduct.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting an alert by id

const deleteAlertById = async (req, res) => {
  try {
    const alert = await vendingMachineModel.findByIdAndDelete(req.params.id);

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
