import { User } from "../resources/user/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_config as config } from "../server.js";

export const newToken = (user) => {
  return jwt.sign({ id: user._id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signup = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.username
  ) {
    return res.status(400).send({
      message: "Required fields missing",
    });
  }
  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).send({ status: "ok", token: token });
  } catch (e) {
    console.log(e);
    if (e.toString().includes("E11000 duplicate key error collection")) {
      return res.status(400).send({ status: "User Already Exists" });
    }
    return res.status(400).send({ status: "Error Communicating with server" });
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Email and password required" });
  const user = await User.findOne({ email: req.body.email }).exec();
  if (!user) {
    return res.status(401).send({ message: "Invalid Credentials" });
  }

  try {
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }
    const token = newToken(user);
    return res.status(201).send({ status: "ok", token: token });
  } catch (e) {
    console.log();
    return res.status(401).send({ message: "Not Authorized" });
  }
};

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).end();
  }
  try {
    const payload = await verifyToken(token);
    const user = await User.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).end();
  }
};
