const admin = require('firebase-admin');
const serviceAccount = require('./fpolyphone-173e2-firebase-adminsdk-779jo-993b46c9d5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'https://fpolyphone-173e2-default-rtdb.asia-southeast1.firebasedatabase.app',
  storageBucket: 'gs://fpolyphone-173e2.appspot.com',
});

const db = admin.firestore();
const realtimeDatabase = admin.database();

module.exports = { admin, db , realtimeDatabase};

