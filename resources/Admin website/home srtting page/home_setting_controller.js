import {HomePage} from "./home_setting_model";

const add_home_setting = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "Admin Not Found" });
          }
          const {image_title,image_description_1,image_description_2,image_description_3,image_description_4} = req.files;
          const add_data = await HomePage.create({
              ...req.body,
                image_title,image_description_1,image_description_2,image_description_3,image_description_4
            
            });
            console.log(add_data);
            res.status(201).json({status: "OK", data: add_data});
    }catch(e){
        console.log(e);
        res.status(400).json({status: "failed", data: e});
    }
};
const view_home_setting = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "admin Not Found" });
          }
          const view_all = await HomePage.find({});
          res.status(201).json({status: "OK", data: view_all});
    }catch(e){
        console.log(e);
        res.send(e);  
      }
};

const view_id_home_setting = async(req,res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.params.id;
          const view_by_id = await HomePage.findById(id);
          if(!view_by_id) {
              res.status(400).json({ message: "no setting found"});
          }
          res.status(200).json({ status: "ok" , data: view_by_id});
          
    }catch(e){
        res.status(400).send(e);
    }
};
const update_home_setting = async(req,res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.params.id
          const check = await HomePage.findById(id);
          if(!check) {
              res.status(400).json({ message: "no setting found"});
          }
          const {image_title,image_description_1,image_description_2,image_description_3,image_description_4} = req.files;
          const update = await HomePage.findByIdAndUpdate(id,{$set:req.body, image_title,image_description_1,image_description_2,image_description_3,image_description_4}, {new:true});
          console.log(update);
          res.status(200).json({status:"ok", data:update});
    }catch(e){
        res.send(e);
    }
    
};

const delete_home_setting = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(400).json({ message: "User Not Found" });
          }
          const id = req.params.id
          const check = await HomePage.findById(id);
          if(!check) {
              res.status(400).json({ message: "no setting found"});
          }

          const remove_home_setting = await HomePage.findByIdAndDelete(id);
          res.status(200).json({success:"ok", data: remove_home_setting});
    }catch(e){
        res.send(e);
    }
};
export {add_home_setting, view_home_setting, view_id_home_setting, update_home_setting, delete_home_setting};