import AWS from "aws-sdk";
import { SECRETS } from "../../util/config";
import { User } from "../user/user.model";
import { Email } from "./email_template_model";

AWS.config.update({ region: SECRETS.region });

var ses = new AWS.SES();
// Create promise and SES service object
const verify_email = async (req, res) => {
  //try {
  if (!req.user) {
    return res.status(400).json({ message: "User not found" });
  }
  const email = req.body.email;
  var verifyEmailPromise = new AWS.SES()
    .verifyEmailIdentity({ EmailAddress: email })
    .promise();
  verifyEmailPromise
    .then(function (data) {
      res.send(
        "Email verification initiated, please check your email address!"
      );
      console.log(data);
    })
    .catch(function (err) {
      res.send(err);
    });
};

const list_verified_emails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!" });
    }
    const get_list = await ses.listVerifiedEmailAddresses(async (err, data) => {
      if (err) {
        console.log(err);
      }
      const verify = await data.VerifiedEmailAddresses.filter(
        (x) => x == req.user.email_to_send
      );
      console.log(verify);
      if (!verify.length) {
        const is_not_verified = await User.findByIdAndUpdate(
          req.user._id,
          { $set: { is_verified: false } },
          { new: true }
        );
        return res.status(400).json({
          message: "not verified!!",
          data: is_not_verified.is_verified,
        });
      }
      const make_verify = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { is_verified: true } },
        { new: true }
      );
      console.log(make_verify);

      res.json({ success: "you are verified", data: make_verify.is_verified });
    });
    //console.log(get_list);
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
};

const delete_verify_list = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!" });
    }
    var params = {
      EmailAddress: req.body.email,
    };

    await ses.deleteVerifiedEmailAddress(params, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send("Verified user deleted successfully!!!");
      }
    });
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
};
const send_email = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!!" });
    }
    const send_email = req.body.email;
    // const id = req.params.id;
    // const template = await Email.findById(id);
    // var ses_mail = "testing AWS SES";

    const params = {
      Source: req.user.email_to_send,
      Template: req.body.template,
      ConfigurationSetName: "ConfigSet",
      Destination: {
        ToAddresses: [send_email],
      },
      TemplateData: '{ "first-name":"Pratheek","last-name":"Kawthekar" }',
    };
    ses.sendTemplatedEmail(params, (err, data) => {
      if (err) console.log(err, err.stack);
      // an error occurred
      else {
        res.json({ success: "Email Template Send" });
        console.log(data); // successful response
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

const create_email_template = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!!" });
    }
    const createObject = { ...req.body, userID: req.user._id };
    const email = await Email.create(createObject);
    var params = {
      Template: {
        TemplateName: req.body.title /* required */,
        HtmlPart: `${req.body.body}`,
        SubjectPart: req.body.subject,
      },
    };

    // Create the promise and SES service object
    var templatePromise = ses.createTemplate(params).promise();

    // Handle promise's fulfilled/rejected states
    templatePromise
      .then(function (data) {
        console.log("Template Updated");
        res.json({ success: "Email Template created", data: email });
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

const update_email_template = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!!" });
    }
    const updateObject = { ...req.body };
    const id = req.params.id;
    const email = await Email.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    // Create updateTemplate parameters
    var params = {
      Template: {
        TemplateName: req.body.title /* required */,
        HtmlPart: `${req.body.body}`,
        SubjectPart: req.body.subject,
      },
    };

    // Create the promise and SES service object
    var templatePromise = ses.updateTemplate(params).promise();

    // Handle promise's fulfilled/rejected states
    templatePromise
      .then(function (data) {
        console.log("Template Updated");
        res.json({ success: "Email Template updated", data: email });
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

const delete_email_template = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!!" });
    }
    const id = req.params.id;
    const email = await Email.findByIdAndDelete(id, { new: true });
    res.json({ success: "Email Template deleted" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

const view_email_template = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!!" });
    }
    const email = await Email.find({ userID: req.user._id });
    res.send(email);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

const view_email_template_byid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found!!" });
    }
    const id = req.params.id;
    const email = await Email.findById(id);
    res.send(email);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

export {
  verify_email,
  send_email,
  list_verified_emails,
  create_email_template,
  update_email_template,
  delete_email_template,
  view_email_template,
  view_email_template_byid,
};
