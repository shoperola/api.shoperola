import { Orders } from "../../orders/order_model";
import lodash from "lodash";
import { User } from "../../user/user.model";
import { UserAddress } from "../../ConfigAddress/address_model";
import franchiseProductModel from "../../FranchiseProduct/franchise.model";

const getAllOrders = async (req, res) => {
  try {
    // if (!req.user) {
    //   return res.status(400).json({ message: "User Not Found" });
    // }
    const view_order = await Orders.find({});

    const see_order = await view_order.filter(
      (x) => x.status !== "PENDING_PAYMENT"
    );
    res.status(200).json({ data: see_order, status: true });
  } catch (err) {
    console.log(err);
    res.status(401).send(err.message);
  }
};
const getOrderByOrderId = async (req, res) => {
  try {
    const view_order = await Orders.find({
      order_id: req.params.order_id,
    }).populate([{ path: "userID", model: "users" }]);

    const userId = await Orders.find({
      order_id: req.params.order_id,
    });
    const findUserOrders = await UserAddress.find({
      userID: userId[0].userID,
    });

    const ordersData = lodash.pick(view_order[0], [
      "status",
      "createdAt",
      "order_id",
      "razorpay_order_id",
      "razorpay_payment_id",
      "totalPrice",
      "totalQuantity",
      "shipping_id",
      "GSTPrice",
      "product",
      "userID",
      "userAddress",
    ]);

    ordersData.userID = lodash.pick(view_order[0].userID, [
      "firstName",
      "lastName",
      "email",
      "contactNo",
    ]);

    ordersData.userAddress = lodash.pick(findUserOrders[0], [
      "AdminAddress",
      "company_name",
      "city",
      "state",
      "pincode",
      "contact_number",
      "email",
      "country",
    ]);

    res.status(200).json({ data: ordersData, status: true });
  } catch (err) {
    console.log(err);
    res.status(401).send(err.message);
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { status, orderId, shipingId } = req.body;
    const view_order = await Orders.find({ order_id: orderId });

    view_order[0].status = status;
    view_order[0].shipping_id = shipingId;

    // for handle stock in hand client side
    if (status === "DELIVERED") {
      const { userID, product } = view_order[0];

      // check existance
      const exist = await franchiseProductModel.find({
        userID: userID,
      });

      if (exist) {
        product.map(async (prod) => {
          const findProductId = await franchiseProductModel.findOne({
            userID: userID,
            productId: prod.productId,
          });
          if (findProductId) {
            findProductId.qty += prod.qty;
            console.log(findProductId.qty, " ", prod.qty);
            await findProductId.save();
          } else {
            const franchiseOrderObj = new franchiseProductModel({
              userID,
              productId: prod.productId,
              title: prod.title,
              description: prod.description,
              price: prod.price,
              qty: prod.qty,
              image: prod.image,
            });
            await franchiseOrderObj.save();
          }
        });
      } else {
        product.map(async (prod) => {
          const franchiseOrderObj = new franchiseProductModel({
            userID,
            productId: prod.productId,
            title: prod.title,
            description: prod.description,
            price: prod.price,
            qty: prod.qty,
            image: prod.image,
          });
          await franchiseOrderObj.save();
        });
      }
    }

    await view_order[0].save();

    res.status(201).json({ data: view_order[0], status: true });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

export { updateOrderStatus, getAllOrders, getOrderByOrderId };
