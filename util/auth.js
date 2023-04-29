import { Payment } from "../resources/payments/payments.model";
import { newToken, verifyToken } from "./jwt";
import { User } from "../resources/user/user.model";
import { Logo } from "../resources/ConfigLogo/logo_model";
import { Cart } from "../resources/Cart/cart_model";
import AWS from "aws-sdk";
import { SECRETS } from "./config";
import generator from 'generate-password';
import bcrypt from "bcrypt";
import { sendMail } from "./mail";



AWS.config.update({ region: SECRETS.region });

var ses = new AWS.SES();

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
    const cart = await Cart.create({});
    cart.userID = user._id;
    await cart.save();
    user.cartID = cart._id;
    await user.save();
    //  email ////////////////////////////////////////////
    const send_email = req.body.email;
    const params = {
      Source: "hello@shoperola.com",
      Template: "vm_welcome",
      ConfigurationSetName: "ConfigSet",
      Destination: {
        ToAddresses: [send_email],
      },
      TemplateData: `{ "first-name": "${req.body.firstName}","last-name": "${req.body.lastName}"}`
    };
    ses.sendTemplatedEmail(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      }
      else console.log(data); // successful response
    });
    /////////////////////////////////////////
    return res.status(201).send({ status: "ok", token: token });
  } catch (e) {
    console.log(e.message);
    console.log();
    if (e.toString().includes("E11000 duplicate key error collection")) {
      return res.status(400).send({
        status: `${collectionName === "users" ? "User" : "Client"
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


const forgotPassword = async (req, res) => {
  const Model = req.model;
  if (!req.body.forgot)
    return res.status(400).send({ message: "Email is required" });
  const user = await Model.findOne({ email: req.body.forgot }).exec();

  if (!user) {
    return res.status(400).send({ message: "Invalid Email" });
  }

  const password = generator.generate({
    length: 5,
    numbers: true,
  });

  try {
    // const match = user.changePassoword(password);
    user.password = password;
    await user.save();
    const { firstName, lastName, email } = user;

    const sendOrNot = sendMail(firstName + lastName, email, password);

    if (sendOrNot) {
      return res.status(201).send({ status: "ok", success: true });
    } else {
      return res.status(400).send({ message: "Not Send Mail" });
    }

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

const vendingsignin = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Email and password required" });
  const user = await User.findOne({ stored_email: req.body.email }).exec();
  if (!user) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  } try {
    console.log(user.stored_password + req.body.password);
    if (user.stored_password === req.body.password) {
      const token = newToken(user);
      const logoObject = await Logo.findOne({ userID: user._id });
      return res.status(201).send({ status: "ok", loginStatus: true, logo: logoObject.logo, token: token });
    }
    return res.status(401).send({ message: "Wrong Password" });

  } catch (e) {
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

export { signup, signin, protect, vendingsignin, vendingprotect, forgotPassword };
//shoperolaadmin@gmail.com