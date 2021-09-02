import AWS from "aws-sdk";
import { SECRETS } from "../../util/config";
import {User} from "../user/user.model";

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
        const get_list = await ses.listVerifiedEmailAddresses((err,data) => {
            if(err){
                console.log(err);
            }
            console.log(data.VerifiedEmailAddresses);
            res.send(data);
        })
        //console.log(get_list);
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
    var ses_mail = "testing AWS SES";
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
             Data: "HTML_FORMAT_BODY"
            },
            Text: {
             Charset: "UTF-8",
             Data: "Testing AWS-SES"
            }
           },
           Subject: {
            Charset: 'UTF-8',
            Data: 'Test email'
           }
          },
        Source: 'kawthekar56@gmail.com', /* required */
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
export {verify_email, send_email,list_verified_emails}
