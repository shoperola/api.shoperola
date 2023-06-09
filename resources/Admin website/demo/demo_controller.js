import {Demo} from "./demo_model";

const defaultResponseObject = {
    success: true,
    data: null, //{},[] or null
    message: "",
    error: null,
  };

const add_demo = async (req, res) => {
    try{
          const add_demo = await Demo.create({ip_address:req.ip,...req.body});
          let response = defaultResponseObject;
          response.data = add_demo;
          res.status(201).send(response);
    }catch(e){
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
    }
};

const view_Demo = async (req, res) => {
    try {
        const view_Demo = await Demo.find({});
        let response = defaultResponseObject;
          response.data = view_Demo;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
};
const view_Demo_id = async (req, res) => {
    try {
        const id = req.params.id;
        const view_Demo_id = await Demo.findById(id);
        if(!view_Demo_id) {
            res.status(404).send("no demo found!!")
        }
        let response = defaultResponseObject;
          response.data = view_Demo_id;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
};

const update_Demo = async (req, res) => {
    try {
        if(!req.user){
            res.status(400).send("no admin found!!!");
        }
        const id = req.params.id;
        const update_Demo = await Demo.findByIdAndUpdate(id,{$set:req.body});
         let response = defaultResponseObject;
          response.data = update_Demo;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
};

const delete_Demo = async (req, res) => {
    try {
        if(!req.user){
            res.status(400).send("no admin found!!!");
        }
        const id = req.params.id;
        const delete_Demo = await Demo.findByIdAndDelete(id);
         let response = defaultResponseObject;
          response.data = delete_Demo;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
}
export {add_demo, view_Demo, view_Demo_id,update_Demo, delete_Demo};