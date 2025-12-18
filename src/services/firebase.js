const admin = require("firebase-admin");
const env = require("../config/env");
const serviceAccount = require("../config/firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: env.FIREBASE.projectId,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
};
