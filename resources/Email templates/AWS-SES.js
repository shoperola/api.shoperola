import AWS from "aws-sdk";
import { SECRETS } from "../../util/config";
import {User} from "../user/user.model";
import {Email} from "./email_template_model";
 
AWS.config.update({region: SECRETS.region});

var ses = new AWS.SES();
// Create promise and SES service object
const verify_email = async (req, res) => {
    //try {
        if(!req.user){
            return res.status(400).json({ message: "User not found"});
        }
        const email = req.body.email
        var verifyEmailPromise = new AWS.SES().verifyEmailIdentity({EmailAddress: email}).promise();
        verifyEmailPromise.then(
            function(data) {
              res.send("Email verification initiated, please check your email address!");
              console.log(data);
             }).catch(
              function(err) {
              res.send(err);
            });
};

const list_verified_emails = async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!"})
        }
        const get_list = await ses.listVerifiedEmailAddresses(async(err,data) => {
            if(err){
                console.log(err);
            }
            const verify = await data.VerifiedEmailAddresses.filter(x => x == req.user.email_to_send);
            console.log(verify);
            if(!verify.length){
                const is_not_verified = await User.findByIdAndUpdate(req.user._id, {$set: {is_verified: false}},{new: true});
                return res.status(400).json({message:"not verified!!", data: is_not_verified.is_verified});
            }
            const make_verify = await User.findByIdAndUpdate(req.user._id, {$set: {is_verified: true}},{new: true});
            console.log(make_verify);

            res.json({success:"you are verified" , data: make_verify.is_verified});
        })
        //console.log(get_list);
    } catch (e) {
        console.log(e);
        res.send(e.message);
    }
};

const delete_verify_list = async(req,res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!"});
        }
        var params = {
            EmailAddress: req.body.email
        };
    
       await ses.deleteVerifiedEmailAddress(params, function(err, data) {
            if(err) {
                res.send(err);
            } 
            else {
                res.send("Verified user deleted successfully!!!");
            } 
        });
    } catch (e) {
        console.log(e);
        res.send(e.message);
    }
}
const send_email = async(req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!!"});
        }
        const send_email = req.body.email
   // var ses_mail = "testing AWS SES";
    var params = {
        Destination: { /* required */
          ToAddresses: [
            send_email,
            /* more items */
          ]
        },
        Message: { /* required */
          Body: { /* required */
            Html: {
             Charset: "UTF-8",
             Data: req.body.html
            },
            // Text: {
            //  Charset: "UTF-8",
            //  Data: "Testing AWS-SES"
            // }
           },
           Subject: {
            Charset: 'UTF-8',
            Data: req.body.subject
           }
          },
        Source: req.user.email_to_send
      };
    
   await ses.sendEmail(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        }           
    });
    } catch (e) {
        console.log(e);
        res.status(400).json({message: e.message});
    }
}

const create_email_template= async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!!"});
        }
        const createObject={...req.body,userID: req.user._id};
        const email= await Email.create(createObject);
        res.json({success:"Email Template created" , data: email});
    } catch (e) {
            console.log(e);
            res.status(400).json({message: e.message});
        }
};

const update_email_template= async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!!"});
        }
        const updateObject={...req.body};
        const id= req.params.id;
        const email= await Email.findByIdAndUpdate(id,updateObject,{new:true});
        res.json({success:"Email Template updated" , data: email});
    } catch (e) {
            console.log(e);
            res.status(400).json({message: e.message});
        }
};

const delete_email_template= async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!!"});
        }
        const id= req.params.id;
        const email= await Email.findByIdAndDelete(id,{new: true});
        res.json({success:"Email Template deleted"});
    } catch (e) {
            console.log(e);
            res.status(400).json({message: e.message});
        }
};

const view_email_template= async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!!"});
        }
        const email= await Email.find({userID: req.user._id});
        res.send(email);
    } catch (e) {
            console.log(e);
            res.status(400).json({message: e.message});
        }
};

const view_email_template_byid= async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ message: "User not found!!"});
        }
        const id= req.params.id;
        const email= await Email.findById(id);
        res.send(email);
    } catch (e) {
            console.log(e);
            res.status(400).json({message: e.message});
        }
};



export {verify_email, send_email,list_verified_emails,create_email_template,update_email_template,delete_email_template,view_email_template,view_email_template_byid}
