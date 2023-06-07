import express from "express";
import { getFranchiseAlert } from "./alert.controller";
import Alert from "./alert.model";
import vendingMachineModel from "../VendingMachine/vending.model";
import cron from "node-cron";
const router = express.Router();

cron.schedule("*/2 * * * *", async (req, res) => {
  try {
    const vendingProduct = await vendingMachineModel.find({});

    // console.log(vendingProduct[0].product)

    vendingProduct.map((user) => {
      user.product.map(async (prod) => {
        if (prod.qty === 0) {
          const alreadyAlert = await Alert.findOne({ productName: prod.title });
          if (!alreadyAlert) {
            const insAlert = new Alert({
              userID: user.userID,
              productName: prod.title,
              displayName: "no stock",
            });
            await insAlert.save();
          }
        } else if (prod.qty === 1) {
          const alreadyAlert = await Alert.findOne({ productName: prod.title });
          if (!alreadyAlert) {
            const insAlert = new Alert({
              userID: user.userID,
              productName: prod.title,
              displayName: "low stock",
            });
            await insAlert.save();
          }
        } 
      });
    });
  } catch (error) {
    console.log("crone error");
  }
});

router.get("/getAlert", getFranchiseAlert);

export default router;
