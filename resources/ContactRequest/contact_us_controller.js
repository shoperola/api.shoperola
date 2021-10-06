import { Contact } from "./contact_us_model";

const add_contact = async (req, res) => {
  try {
    const add_contact = await Contact.create({ ...req.body });
    res.status(201).send(add_contact);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

const view_contact = async (req, res) => {
  try {
    const view_contact = await Contact.find({});

    res.status(200).send(view_contact);
  } catch (e) {
    res.status(400).send(e);
  }
};

const view_contact_id = async (req, res) => {
  try {
    const id = req.params.id;
    const view_contact_id = await Contact.findById(id);
    if (!view_contact_id) {
      res.status(404).send("no contact request found!!");
    }
    res.status(201).send(view_contact_id);
  } catch (e) {
    res.status(400).send(e);
  }
};

const update_contact = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400).send("no admin found!!!");
    }
    const id = req.params.id;
    const update_contact = await Contact.findByIdAndUpdate(id, {
      $set: req.body,
    });
    res.status(201).send(update_contact);
  } catch (e) {
    res.status(400).send(e);
  }
};

const delete_contact = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400).send("no admin found!!!");
    }
    const id = req.params.id;
    const delete_contact = await Contact.findByIdAndDelete(id);
    res.status(201).send(delete_contact);
  } catch (e) {
    res.status(400).send(e);
  }
};
export {
  add_contact,
  view_contact,
  view_contact_id,
  update_contact,
  delete_contact,
};
