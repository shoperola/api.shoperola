import { UserAddress } from "./address_model";

const update_Address = async (req, res) => {
  try {
    // if (!req.user) {
    //   return res.status(400).json({ message: "User Not Found" });
    // }
    const id = req.user._id;
    const doc = await UserAddress.findById(id);
    if (!doc) {
      const add_Address = await UserAddress.create({
        ...req.body,
        userID: req.user._id,
      });
      return res.status(201).json({ success: "ok", data: add_Address });
    }
    const update = await UserAddress.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    console.log(update);
    res.status(200).json({ success: "ok", data: update });
  } catch (e) {
    res.send(e);
    res.status(400).json({ message: e.message });
  }
};

const view_Address = async (req, res) => {
  try {
    const userId = req.user._id;
    const view = await UserAddress.findOne({
      userID: userId,
    });
    res.status(200).json({ success: true, data: view });
  } catch (e) {
    res.send(e);
  }
};

export { update_Address, view_Address };
