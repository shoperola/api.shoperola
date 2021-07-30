import { Categories } from "./Content_category_model";

const add_Categories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const category = await Categories.create({ ...req.body});
      res.status(201).json({category});
    } catch (e) {
      res.send(e.message);
    }
  };
  
  const view_Categories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const id = req.params.id;
      const check = await Categories.findById(id);
      if (!check) {
        res.send("no Categories found!!");
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
      const view_Categories = await Categories.find({userID: req.user._id})
      res.send(view_Categories);
    } catch (e) {
      res.send(e.message);
    }
  };
  
  const update_Categories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const id = req.params.id;
      const check = await Categories.findById(id);
      if (!check) {
        res.send("no Categories found!!");
      }
      const update = await Categories.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.send(update);
    } catch (e) {
      res.send(e.message);
    }
  };
  
  const delete_Categories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
      const id = req.params.id;
      const check = await Categories.findById(id);
      if (!check) {
        res.send("no Categories found!!");
      }
      const deletee = await Categories.findByIdAndDelete(id);
      res.send(deletee);
    } catch (e) {
      res.send(e.message);
    }
  };
  
  export { add_Categories, view_Categories, view, update_Categories, delete_Categories };
  