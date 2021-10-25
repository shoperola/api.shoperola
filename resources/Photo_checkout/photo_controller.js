import {Photo} from "./photo_model";

const uploadPhoto=async(req,res,next)=>{
       try {
         if (!req.user) {
           return res.status(400).json({ message: "User Not Found" });
         }
         const createLogo = { photo: req.file.location, userID: req.user._id };
         const upload_logo = await Photo.create(createLogo);
         console.log(upload_logo);
         res.status(201).json({ success: "ok", data: upload_logo });
       } catch (e) {
         res.status(400).json(e);
       }
}
const view_photo = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400).json({ message: "User not found" });
    }
    const view = await Photo.find({});
    res.status(200).json({ status: "ok", data: view });
  } catch (err) {
    res.send(err);
  }
};
export {uploadPhoto,view_photo};