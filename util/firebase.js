// import admin from "firebase-admin";
// import serviceAccount from "../tellytell-236a3-firebase-adminsdk-5j5og-9217d9f856.json";
// // import { Client } from "../resources/client/client.model";
// // import { Subscription } from "../subscription/subscription.model";

// // console.log(serviceAccount);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   projectId: serviceAccount.project_id,
// });

// export const firebaseAuthProtect = async (req, res, next) => {
//   try {
//     const Authorization = req.headers.authorization;
//     if (!Authorization) {
//       return res.status(401).json({ message: "Token Not Provided" });
//     }
//     console.log(Authorization);
//     const token = Authorization.split("Bearer ")[1].trim();
//     console.log(token);
//     if (!token) {
//       return res.status(401).json({ message: "Token Not Provided" });
//     }
//     const decoded = await admin.auth().verifyIdToken(token);
//     console.log(decoded);
//     req.user = decoded;
//     console.log(req.user);
//     next();
//   } catch (e) {
//     console.log(e.message);
//     return res.status(401).json();
//   }
// };
