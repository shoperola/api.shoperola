import { ContentCategories } from "./Content_category_model";

const add_ContentCategories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const category = await ContentCategories.create({ ...req.body});
      res.status(201).json({category});
    } catch (e) {
      res.send(e.message);
    }
  };
  
  const view_ContentCategories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const id = req.params.id;
      const check = await ContentCategories.findById(id);
      if (!check) {
        res.send("no ContentCategories found!!");
      }
      res.send(check);
    } catch (e) {
      res.send(e.message);
    }
  };
  
  const view = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const view_ContentCategories = await ContentCategories.find({userID: req.user._id})
      res.send(view_ContentCategories);
    } catch (e) {
      res.send(e.message);
    }
  };
  
  const update_ContentCategories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const id = req.params.id;
      const check = await ContentCategories.findById(id);
      if (!check) {
        res.send("no ContentCategories found!!");
      }
      const update = await ContentCategories.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.send(update);
    } catch (e) {
      res.send(e.message);
    }
  };
  
  const delete_ContentCategories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const id = req.params.id;
      const check = await ContentCategories.findById(id);
      if (!check) {
        res.send("no ContentCategories found!!");
      }
      const deletee = await ContentCategories.findByIdAndDelete(id);
      res.send(deletee);
    } catch (e) {
      res.send(e.message);
    }
  };
  
  export { add_ContentCategories, view_ContentCategories, view, update_ContentCategories, delete_ContentCategories };
  