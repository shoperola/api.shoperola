import {Newsletter} from "./newsletter_model";

const defaultResponseObject = {
    success: true,
    data: null, //{},[] or null
    message: "",
    error: null,
  };

const add_news = async (req, res) => {
    try{
          const add_news = await Newsletter.create({ip_address:req.ip,...req.body});
          let response = defaultResponseObject;
          response.data = add_news;
          res.status(201).send(response);
    }catch(e){
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
    }
};

const view_news = async (req, res) => {
    try {
        const view_Newsletter = await Newsletter.find({});
        let response = defaultResponseObject;
          response.data = view_Newsletter;
          res.status(201).send(response);
    } catch (e) {
        console.log(e);
        let response = defaultResponseObject;
        response.success = false;
        response.error = e;
        res.status(400).send(response);
        
    }
};

export {add_news,view_news};