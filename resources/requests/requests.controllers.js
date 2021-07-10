import { Request } from "./requests.model";
import { User } from "../user/user.model";

export const createRequest = async (req, res) => {
  console.log(req.files, req.body);
  const videoLink = req.files["video"][0].location;
  const attachLinks = req.files["attach"].map((item) => {
    return {
      filename: item.originalname,
      link: item.location,
    };
  });

  const user = await User.findById(req.body.userID);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    const doc = await Request.create({
      clientID: req.user._id,
      userID: req.body.userID,
      attachments: attachLinks,
      requestVideo: videoLink || "",
      requestText: req.body.requestText,
    });
    res.json({ status: "ok", data: doc });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Error creating request" });
  }
};
