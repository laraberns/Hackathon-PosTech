const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require('./creds.json');

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();

const db = getFirestore()

module.exports = { auth };
module.exports = { db }