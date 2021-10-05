import { Rack } from "./rack_model";

const rackcreate = async (req, res) => {
  try {
    const object = { ...req.body };
    const rack = await Rack.create({ object, userID: req.user._id });
    console.log(rack);
    res.json({ status: "created", data: rack });
  } catch (e) {
    res.json(e.message);
  }
};

const rackupdate = async (req, res) => {
  try {
    const rack = await Rack.find({ userID: req.user._id });
    console.log(rack);
    const updateObject = { ...req.body };
    const id = rack[0]._id;
    const rackupdateObject = await Rack.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    console.log(rack);
    res.json({ status: "updated", data: rackupdateObject });
  } catch (e) {
    res.json(e.message);
  }
};

const rackview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not Found" });
    }
    const rack = await Rack.findOne({ userID: req.user._id })
      .populate("rack11")
      .populate("rack12")
      .populate("rack13")
      .populate("rack14")
      .populate("rack15")
      .populate("rack16")
      .populate("rack21")
      .populate("rack22")
      .populate("rack23")
      .populate("rack24")
      .populate("rack25")
      .populate("rack26")
      .populate("rack31")
      .populate("rack32")
      .populate("rack33")
      .populate("rack34")
      .populate("rack35")
      .populate("rack36")
      .populate("rack41")
      .populate("rack42")
      .populate("rack43")
      .populate("rack44")
      .populate("rack45")
      .populate("rack46")
      .populate("rack51")
      .populate("rack52")
      .populate("rack53")
      .populate("rack54")
      .populate("rack55")
      .populate("rack56")
      .populate("rack61")
      .populate("rack62")
      .populate("rack63")
      .populate("rack64")
      .populate("rack65")
      .populate("rack66")
      .exec();
    res.json({ status: "OK", data: rack });
  } catch (e) {
    res.json(e.message);
  }
};

const rackdelete = async (req, res) => {
  try {
    const rack = await Rack.find({ userID: req.user._id });
    const rackname = req.body.rackname;
    console.log(rack[0]);
    if (rackname in rack[0]) {
      console.log("true");
    }
    // `rack[0].${rackname}` = " ";
    await rack[0].save();

    res.json({ status: "updated", data: rack });
  } catch (e) {
    res.json(e.message);
  }
};

export { rackcreate, rackupdate, rackview, rackdelete };
