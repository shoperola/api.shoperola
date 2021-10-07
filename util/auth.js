import { Payment } from "../resources/payments/payments.model";
import { newToken, verifyToken } from "./jwt";
import {User} from "../resources/user/user.model";
import {Logo} from "../resources/ConfigLogo/logo_model";


const signup = async (req, res) => {
  const Model = req.model;
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.status(400).send({
      message: "Required fields missing",
    });
  }
  try {
    const user = await Model.create(req.body);
    const collectionName = Model.collection.collectionName;
    if (collectionName === "users" || collectionName === "Admin") {
      await Payment.create({ userID: user._id });
    }
    const token = newToken(user);
    return res.status(201).send({ status: "ok", token: token });
  } catch (e) {
    console.log(e.message);
    console.log();
    if (e.toString().includes("E11000 duplicate key error collection")) {
      return res.status(400).send({
        status: `${
          collectionName === "users" ? "User" : "Client"
        } Already Exists`,
      });
    }
    return res.status(400).send({ status: "Error Communicating with server" });
  }
};

const signin = async (req, res) => {
  const Model = req.model;

  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Email and password required" });
  const user = await Model.findOne({ email: req.body.email }).exec();
  if (!user) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  try {
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }
    const token = newToken(user);
    return res.status(201).send({ status: "ok", token: token });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const protect = async (req, res, next) => {
  const Model = req.model;
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).end();
  }
  try {
    const payload = await verifyToken(token);
    console.log(payload);
    const user = await Model.findById(payload.id)
      .populate({ path: "subjects", select: "-addedBy -__v" })
      .populate({ path: "languages", select: "name" })
      .select("-password -identities")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).end();
  }
};

const vendingsignin= async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Email and password required" });
  const user=await User.findOne({ stored_email: req.body.email}).exec();
  if(!user){
    return res.status(400).send({ message: "Invalid Email or Password" });
  }try{
    console.log(user.stored_password + req.body.password);
    if(user.stored_password===req.body.password){
      const token = newToken(user);
      const logo=await Logo.findOne({userID:user._id});
      console.log(logo);
      return res.status(201).send({ status: "ok", loginStatus:true,logo:logo,token: token});
    }
    return res.status(401).send({ message: "Wrong Password" });

  }catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
}

const vendingprotect = async (req, res, next) => {
  const Model = req.model;
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).end();
  }
  try {
    const payload = await verifyToken(token);
    console.log(payload);
    const user = await Model.findById(payload.id);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).end();
  }
};

export { signup, signin, protect,vendingsignin,vendingprotect };
