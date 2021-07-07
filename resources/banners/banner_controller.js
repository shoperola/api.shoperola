import { Banner } from "./banner_model.js";

//constant for response
const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

const addbanner = async (req, res) => {
  try {
    console.log(req.file);
    const banner = await Banner.create({
      bannerimage: req.file.location,
      title: req.body.title,
      category: req.body.category,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
    });
    console.log(banner);
    res.send(banner);
  } catch (err) {
    res.send(err);
  }
};

const viewbanner = async (req, res) => {
  try {
    const banner = await Banner.find({});
    const response = { ...defaultResponseObject };
    response.data = banner;

    res.status(200).send(response);
  } catch (e) {
    const response = { ...defaultResponseObject };
    response.error = e;
    response.success = false;

    res.status(400).send(response);
  }
};

const viewbanner_by_id = async (req, res) => {
  try {
    const id = req.params.bannerid;

    const check = await Banner.findById(id);
    if (!check) {
      res.send("no banner found");
    }
    const response = { ...defaultResponseObject };
    response.data = check;

    res.status(200).send(response);
  } catch (e) {
    const response = { ...defaultResponseObject };
    response.error = e;
    response.success = false;

    res.status(400).send(response);
  }
};

const editbanner = async (req, res) => {
  try {
    const id = req.params.id;
    const check = await Banner.findById(id);
    if (!check) {
      res.send("no banner found");
    }
    const banner = await Banner.findByIdAndUpdate(id, {
      bannerimage: `${
        req.files[0] && req.files[0].filename ? req.files[0].filename : ""
      }`,
      $set: req.body,
    });
    res.send(banner);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const deletebanner = async (req, res) => {
  try {
    const id = req.params.bannerid;
    const check = await Banner.findById(id);
    if (!check) {
      res.status(400).send("no banner found");
    }
    const banner = await Banner.findByIdAndDelete(id);
    const response = { ...defaultResponseObject };
    response.data = banner;
    res.status(200).send(response);
  } catch (e) {
    const response = { ...defaultResponseObject };
    response.error = e;
    res.status(400).send(response);
  }
};

export { addbanner, viewbanner, viewbanner_by_id, editbanner, deletebanner };
