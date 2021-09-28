import { HomePage } from "./home_setting_model";

const add_home_setting = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "Admin Not Found" });
    }
    const {
      image_title,
      image_description_1,
      image_description_2,
      image_description_3,
      image_description_4,
    } = req.files;
    const home = { ...req.body, adminID: req.user._id };
    image_title ? (home.image_title = image_title[0].location) : null;
    image_description_1
      ? (home.image_description_1 = image_description_1[0].location)
      : null;
    image_description_2
      ? (home.image_description_2 = image_description_2[0].location)
      : null;
    image_description_3
      ? (home.image_description_3 = image_description_3[0].location)
      : null;
    image_description_4
      ? (home.image_description_4 = image_description_4[0].location)
      : null;

    const add_data = await HomePage.create(home);
    console.log(add_data);
    res.status(201).json({ status: "OK", data: add_data });
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "failed", data: e });
  }
};
const view_home_setting = async (req, res) => {
  try {
    const view_all = await HomePage.find({adminID: req.user._id});
    res.status(201).json({ status: "OK", data: view_all });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

// const view_id_home_setting = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const view_by_id = await HomePage.findById(id);
//     if (!view_by_id) {
//       res.status(400).json({ message: "no setting found" });
//     }
//     res.status(200).json({ status: "ok", data: view_by_id });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// };
const update_home_setting = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
  
    const check = await HomePage.find({adminID: req.user._id});
    if (!check) {
      res.status(400).json({ message: "no setting found" });
    }
    const {
      image_title,
      image_description_1,
      image_description_2,
      image_description_3,
      image_description_4,
    } = req.files;
    const home = req.body;
    image_title ? (home.image_title = image_title[0].location) : null;
    image_description_1
      ? (home.image_description_1 = image_description_1[0].location)
      : null;
    image_description_2
      ? (home.image_description_2 = image_description_2[0].location)
      : null;
    image_description_3
      ? (home.image_description_3 = image_description_3[0].location)
      : null;
    image_description_4
      ? (home.image_description_4 = image_description_4[0].location)
      : null;

    const id = check[0]._id;
    const update = await HomePage.findByIdAndUpdate(
      id,
      { $set: home },
      { new: true }
    );
    console.log(update);
    res.status(200).json({ status: "ok", data: update });
  } catch (e) {
    res.send(e);
  }
};

const delete_home_setting = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    
    const check = await HomePage.find({adminID: req.user._id});
    if (!check) {
      res.status(400).json({ message: "no setting found" });
    }
    const id = check[0]._id;
    const remove_home_setting = await HomePage.findByIdAndDelete(id);
    res.status(200).json({ success: "ok", data: remove_home_setting });
  } catch (e) {
    res.send(e);
  }
};
export {
  add_home_setting,
  view_home_setting,
//   view_id_home_setting,
  update_home_setting,
  delete_home_setting,
};
