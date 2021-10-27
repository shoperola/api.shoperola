
import path from "path";

import pkg1 from "@tensorflow/tfjs-node";
const { node } = pkg1;
// /home/tazim/Documents/Shoperola/api.shoperola/util/model
import canvas from "canvas";
import pkg from "@vladmandic/face-api";
const { env, detectAllFaces, tf, nets, SsdMobilenetv1Options } = pkg;
const __dirname=path.resolve();
const modelPathRoot = "./util/model";
const modelPath = path.join(__dirname, modelPathRoot);

let optionsSSDMobileNet;

const { Canvas, Image, ImageData } = canvas;
env.monkeyPatch({ Canvas, Image, ImageData });

async function image(file) {
  const decoded = node.decodeImage(file);
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  decoded.dispose();
  casted.dispose();
  return result;
}

async function detect(tensor) {
  const result = await detectAllFaces(tensor, optionsSSDMobileNet)
    .withAgeAndGender()
    .withFaceExpressions();
  return result;
}

async function main(file, filename) {
  try{

    console.log("FaceAPI single-process test");
    console.log(nets);
    console.log(modelPath);
    await tf.setBackend("tensorflow");
    tf.enableProdMode();
    await tf.ENV.set("DEBUG", false);
    await tf.ready();
  
    console.log("Loading FaceAPI models");
    await nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await nets.ageGenderNet.loadFromDisk(modelPath);
    await nets.faceExpressionNet.loadFromDisk(modelPath);
    optionsSSDMobileNet = new SsdMobilenetv1Options({
      minConfidence: 0.5,
    });
  
    const tensor = await image(file);
    const result = await detect(tensor);
    console.log("Detected faces:", result.length);
  
    // const canvasImg = await canvas.loadImage(file);
    // const out = await faceapi.createCanvasFromMedia(canvasImg);
    // faceapi.draw.drawDetections(out, result);
    // save.saveFile(filename, out.toBuffer("image/jpeg"));
    // console.log(`done, saved results to ${filename}`);
  
    tensor.dispose();
  
    return result;
  }
  catch(e){
      console.log(e);
  }
}

export default {detect:main};
