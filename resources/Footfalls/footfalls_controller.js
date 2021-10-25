import {Footfall} from "./footfalls_model";

const uploadPhotoFootfall=async(req,res,next)=>{
       try {
         const createLogo = { photo: req.file.location};
         const upload_logo = await Footfall.create(createLogo);
         console.log(upload_logo);
         res.status(201).json({ success: "ok", data: upload_logo });
       } catch (e) {
         res.status(400).json(e);
       }
}
const view_photo_footfall = async (req, res) => {
  try {
    const view = await Footfall.find({});
    res.status(200).json({ status: "ok", data: view });
  } catch (err) {
    res.send(err);
  }
};
export {uploadPhotoFootfall,view_photo_footfall};