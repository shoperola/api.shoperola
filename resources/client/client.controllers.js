import { Client } from "./client.model.js";

const getClient = async (req, res) => {
  // check if client with sub is present in db
  try {
    const { sub, username, given_name, family_name, email } = req.user;
    let client = await Client.findOne({ sub: req.user.sub });
    //if not exist create one
    if (!client) {
      client = await Client.create({
        email: email,
        username: username,
        firstName: given_name,
        lastName: family_name,
        sub: sub,
      });
    }
    res.json({ status: "OK", data: client });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error finding client" });
  }
};

export { getClient };
