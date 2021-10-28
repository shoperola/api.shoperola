{
  "name": "mantur-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node --es-module-specifier-resolution=node index",
    "dev": "nodemon --es-module-specifier-resolution=node",
    "format": "prettier --write \"**/*.(js)\"",
    "deploy": "npm run format && git push && git push heroku master",
    "start:pm2": "pm2 start index.js --node-args=\"--es-module-specifier-resolution=node\"",
    "heroku_push": "git add . && git commit -am 'heroku' && git push heroku master",
    "heroku_pull": "git add . && git commit -am 'heroku' && git pull heroku master"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
     "@tensorflow/tfjs": "^2.8.6",
    "@vladmandic/face-api": "^0.13.3",
    "amazon-cognito-identity-js": "^5.0.3",
    "aws-sdk": "^2.910.0",
    "axios": "^0.21.1",
    "bcrypt": "^5.0.1",
    "cors": "^2.8.5",
    "dotenv": "^9.0.2",
     "canvas": "^2.8.0",
    "express": "^4.17.1",
    "express-list-routes": "^1.1.3",
    "express-session": "^1.17.2",
    "firebase-admin": "^9.10.0",
    "jsonwebtoken": "^8.5.1",
    "jwk-to-pem": "^2.0.5",
    "md5": "^2.3.0",
    "mongoose": "^5.12.9",
    "morgan": "^1.10.0",
    "multer": "^1.4.2",
    "multer-s3": "^2.9.0",
    "node-fetch": "^2.6.1",
    "node-schedule": "^2.0.0",
    "pm2": "^5.1.0",
    "stripe": "^8.150.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.7",
    "prettier": "^2.3.0"
  }
}
