import { Router } from "express";
import { createRequest } from "./requests.controllers.js";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import md5 from "md5";
import { config } from "dotenv";
config();

const SECRETS = {
  spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  spacesAcessKey: process.env.DO_SPACES_ACCESS_KEY,
  spacesSecretKey: process.env.DO_SPACES_SECRET_KEY,
};
const spacesEndpoint = new AWS.Endpoint(SECRETS.spacesEndpoint);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: SECRETS.spacesAcessKey,
  secretAccessKey: SECRETS.spacesSecretKey,
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "shott",
    acl: "public-read",
    key: function (request, file, cb) {
      const filenameArray = file.originalname.split(".");
      const extension = filenameArray[filenameArray.length - 1];
      const customFileName = `${md5(file.fieldName + Date.now())}.${extension}`;
      file.filename = `${file.fieldname}-${customFileName}`;
      cb(null, file.filename);
    },
  }),
});

const router = Router();

router.post(
  "/",
  upload.fields([{ name: "video" }, { name: "attach" }]),
  createRequest
);

export default router;
