import { Category } from "./Category_model";
import { User } from "../user/user.model";

const add_category = async (req, res) => {
  try {
    let check = await Category.findOne(req.body);
    if (!check) {
      check = await Category.create(req.body);
    }
    console.log(check);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          categories: check._id,
        },
      },
      { new: true }
    );
    console.log(user);
    res.send(check);
  } catch (e) {
    res.send(e.message);
  }
};

const view_category = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Category.findById(id);
    if (!check) {
      res.send("no category found!!");
    }
    res.send(check);
  } catch (e) {
    res.send(e.message);
  }
};

const view = async (req, res) => {
  try {
    const check = await User.findById(req.user._id, { categories: 1 }).populate(
      "categories"
    );
    res.send(check.categories);
  } catch (e) {
    res.send(e.message);
  }
};

const update_category = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Category.findById(id);
    if (!check) {
      res.send("no category found!!");
    }
    const update = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send(update);
  } catch (e) {
    res.send(e.message);
  }
};

const delete_category = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Category.findById(id);
    if (!check) {
      res.send("no category found!!");
    }
    const deletee = await Category.findByIdAndDelete(id);
    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        categories: id,
      },
    });
    res.send(deletee);
  } catch (e) {
    res.send(e.message);
  }
};

export { add_category, view_category, view, update_category, delete_category };
