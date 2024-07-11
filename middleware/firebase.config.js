const admin = require('firebase-admin');
const serviceAccount = require('./fpolyphone-10302-firebase-adminsdk-eogn5-40fe3287e8.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fpolyphone-10302-default-rtdb.asia-southeast1.firebasedatabase.app',
  storageBucket: 'gs://fpolyphone-10302.appspot.com',
});

const db = admin.firestore();
const realtimeDatabase = admin.database();

module.exports = { admin, db, realtimeDatabase };
