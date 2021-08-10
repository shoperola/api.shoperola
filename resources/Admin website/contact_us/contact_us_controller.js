import {Contact} from "./contact_us_model";
const defaultResponseObject = {
    success: true,
    data: null, //{},[] or null
    message: "",
    error: null,
  };

const add_contact = async (req, res) => {
    try{

          const add_contact = await Contact.create({ip_address:req.ip,...req.body});
          let response = defaultResponseObject;
          response.data = add_contact;
          res.status(201).send(response);
    }catch(e){
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
    }
};

const view_contact = async (req, res) => {
    try {
        const view_contact = await Contact.find({});
        let response = defaultResponseObject;
          response.data = view_contact;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
};

const update_contact = async (req, res) => {
    try {
        if(!req.user){
            res.status(400).send("no admin found!!!");
        }
        const id = req.params.id;
        const update_contact = await Contact.findByIdAndUpdate(id,{$set:req.body});
         let response = defaultResponseObject;
          response.data = update_contact;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
};

const delete_contact = async (req, res) => {
    try {
        if(!req.user){
            res.status(400).send("no admin found!!!");
        }
        const id = req.params.id;
        const delete_contact = await Contact.findByIdAndDelete(id);
         let response = defaultResponseObject;
          response.data = delete_contact;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
}
export {add_contact, view_contact, update_contact, delete_contact};