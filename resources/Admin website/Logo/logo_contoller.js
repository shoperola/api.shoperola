// import {Logo} from "./logo_model";

// const add_logo = async (req, res) => {
//     try{
//         if (!req.user) {
//             return res.status(400).json({ message: "User Not Found" });
//           }
//           const createLogo={logo:req.file.location,adminID: req.user._id};
//           const upload_logo = await Logo.create(createLogo);
//           console.log(upload_logo);
//           res.status(201).json({success: "ok", data: upload_logo});
//     }catch(e){
//         res.send(e)
//     }
// };

// const update_logo = async (req, res) => {
//     try{
//         if(!req.user){
//             return res.status(400).json({ message: "User not Found" });
//         }
//         const check = await Logo.find({adminID: req.user._id});
//         if(!check){
//             res.status(400).json({ message: "no logo found"});
//         }
//         console.log(req.file.location);
//         const id = check[0]._id;
//         const update = await Logo.findByIdAndUpdate(id,{logo: req.file.location},{new: true});
//         console.log(update);
//         res.status(200).json({status:"ok", data: update});
//     }catch(err){
//         res.send(err);
//     }
// };
// const view_logo = async(req,res)=> {
//     try{
//         if(!req.user){
//             res.status(400).json({ message: "User not found" });
//         }
//         const view = await Logo.find({})
//         res.status(200).json({status:"ok", data: view});
//     }catch(err){
//         res.send(err);
//     }
// };
// const delete_logo = async(req,res)=> {
//     try{
//         if(!req.user){
//             res.status(400).json({ message: "User not found" });
//         }
//         const check = await Logo.find({adminID: req.user._id});
//         if(!check){
//             res.status(404).json({ message: "no logo found" });
//         }
//         const id = check[0]._id;
//         const remove = await Logo.findByIdAndDelete(id);
//         console.log(remove);
//         res.status(200).json({ status: "ok" , data: remove});
//     }catch(e){
//         res.send(e);
//     }
// };

// export {add_logo,update_logo, view_logo, delete_logo};