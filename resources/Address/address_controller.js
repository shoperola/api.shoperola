import { Address } from "./address_model";
import { Client } from "../client/client.model";
import {Shipping} from "../shipping_method/shipping_model";

const add_address = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    //  res.json({ status: "OK", data: client });

    const add = await Address.create({ ...req.body, userID: client._id });
    return res.json({ status: "OK", data: add });
  } catch (err) {
    res.send(err);
  }
};


const view_address = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    //  res.json({ status: "OK", data: client });

    const view = await Address.find({userID: client._id});
    res.json({ status: "OK", data: view });
  } catch (e) {
    res.send(e);
  }
};

const view_address_id = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    //  res.json({ status: "OK", data: client });

    const id = req.params.id;
    const view = await Address.findById(id);
    res.json({ status: "OK", data: view });
  } catch (err) {
    res.send(err);
  }
};

const delete_address = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    //  res.json({ status: "OK", data: client });

    const id = req.params.id;
    const remove = await Address.findByIdAndDelete(id);
    res.json({ status: "OK", data: remove });
  } catch (e) {
    res.status(500).send(e);
  }
};
const update_address = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    //  res.json({ status: "OK", data: client });

    const id = req.params.id;
    const update = await Address.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json({ status: "OK", data: update });
  } catch (e) {
    res.send(e);
  }
};

const name_filter = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    //console.log(client._id);
     const address = await Address.findById(req.params.id);
   // console.log(address);
    const shipment = await Shipping.find({$and:[
      {shipping_country:address.Country},
      {shipping_state:address.State}]});

  } catch (e) {
  console.log(e);
  res.status(404).json({ message: e.message });    
  }
}
export {
  add_address,
  view_address,
  view_address_id,
  delete_address,
  update_address,
  name_filter
};
