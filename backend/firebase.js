var admin = require("firebase-admin");

var serviceAccount = require("./account-service-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://lingua-storage.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = { bucket };