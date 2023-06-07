import Product from "./product.model";

const createProduct = async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      qty: req.body.qty,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSnfBD8oiQixFsc59ccAI4fSbIBvvTjUEZuw&usqp=CAU",
    });

    product
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Not Authorized", error: error });
  }
};
const getProduct = async (req, res) => {
  try {
    Product.find()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Not Authorized", error: error });
  }
};
const getProductById = async (req, res) => {
  try {
    Product.findById(req.params.id)
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Not Authorized", error: error });
  }
};
const updateProductById = async (req, res) => {
  try {
    console.log(req.body);
    Product.findById(req.params.id)
      .then((product) => {
        if (product) {
          product.title = req.body.title;
          product.description = req.body.description;
          product.price = req.body.price;
          product.qty = req.body.qty;
          product.stockProduct = req.body.stockProduct;
          // product.image = req.file.path;
          product
            .save()
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: err });
            });
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Not Authorized", error: error });
  }
};

const deleteProductById = async (req, res) => {
  try {
    Product.findByIdAndDelete(req.params.id)
      .then((result) => {
        if (result) {
          res.status(200).json({ message: "Product deleted" });
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Not Authorized", error: error });
  }
};

export {
  createProduct,
  getProductById,
  getProduct,
  updateProductById,
  deleteProductById,
};
