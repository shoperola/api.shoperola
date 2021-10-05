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
      .populate({path:"rack11",populate:{ path:'category'}})
      .populate({path:"rack12",populate:{ path:'category'}})
      .populate({path:"rack13",populate:{ path:'category'}})
      .populate({path:"rack14",populate:{ path:'category'}})
      .populate({path:"rack15",populate:{ path:'category'}})
      .populate({path:"rack16",populate:{ path:'category'}})
      .populate({path:"rack21",populate:{ path:'category'}})
      .populate({path:"rack22",populate:{ path:'category'}})
      .populate({path:"rack23",populate:{ path:'category'}})
      .populate({path:"rack24",populate:{ path:'category'}})
      .populate({path:"rack25",populate:{ path:'category'}})
      .populate({path:"rack26",populate:{ path:'category'}})
      .populate({path:"rack31",populate:{ path:'category'}})
      .populate({path:"rack32",populate:{ path:'category'}})
      .populate({path:"rack33",populate:{ path:'category'}})
      .populate({path:"rack34",populate:{ path:'category'}})
      .populate({path:"rack35",populate:{ path:'category'}})
      .populate({path:"rack36",populate:{ path:'category'}})
      .populate({path:"rack41",populate:{ path:'category'}})
      .populate({path:"rack42",populate:{ path:'category'}})
      .populate({path:"rack43",populate:{ path:'category'}})
      .populate({path:"rack44",populate:{ path:'category'}})
      .populate({path:"rack45",populate:{ path:'category'}})
      .populate({path:"rack46",populate:{ path:'category'}})
      .populate({path:"rack51",populate:{ path:'category'}})
      .populate({path:"rack52",populate:{ path:'category'}})
      .populate({path:"rack53",populate:{ path:'category'}})
      .populate({path:"rack54",populate:{ path:'category'}})
      .populate({path:"rack55",populate:{ path:'category'}})
      .populate({path:"rack56",populate:{ path:'category'}})
      .populate({path:"rack61",populate:{ path:'category'}})
      .populate({path:"rack62",populate:{ path:'category'}})
      .populate({path:"rack63",populate:{ path:'category'}})
      .populate({path:"rack64",populate:{ path:'category'}})
      .populate({path:"rack65",populate:{ path:'category'}})
      .populate({path:"rack66",populate:{ path:'category'}})
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
