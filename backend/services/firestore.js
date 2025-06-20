// Firestore Service
// Handles Firestore initialization and data operations for TLC Insights backend.
//
// Place your Firebase service account key as 'serviceAccountKey.json' in the backend directory.

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

let initialized = false;
function initFirestore() {
  if (!initialized) {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
    });
    initialized = true;
  }
  return admin.firestore();
}

// Example: Write a Meta campaign document
async function writeMetaCampaign(campaign) {
  const db = initFirestore();
  await db.collection('meta_campaigns').doc(campaign.id).set(campaign);
}

// Example: Read all Meta campaigns
async function getMetaCampaigns() {
  const db = initFirestore();
  const snapshot = await db.collection('meta_campaigns').get();
  return snapshot.docs.map(doc => doc.data());
}

// TODO: Add similar functions for GA events, GTM events, conversions, etc.

module.exports = {
  writeMetaCampaign,
  getMetaCampaigns,
  // Add more exports as needed
}; 