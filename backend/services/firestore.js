// Firestore Service
// Handles Firestore initialization and data operations for TLC Insights backend.
//
// Uses the GOOGLE_APPLICATION_CREDENTIALS environment variable which should point
// to your 'serviceAccountKey.json' file.

const admin = require('firebase-admin');

let db;

function initFirestore() {
  if (!db) {
    admin.initializeApp();
    db = admin.firestore();
  }
  return db;
}

/**
 * Writes a Meta campaign document to Firestore.
 * @param {object} campaign The campaign data to write.
 */
async function writeMetaCampaign(campaign) {
  const firestore = initFirestore();
  const docRef = firestore.collection('meta_campaigns').doc(campaign.id);
  await docRef.set(campaign, { merge: true });
}

/**
 * Reads all Meta campaigns from Firestore.
 * @returns {Promise<Array>} An array of campaign documents.
 */
async function getMetaCampaigns() {
  const firestore = initFirestore();
  const snapshot = await firestore.collection('meta_campaigns').get();
  return snapshot.docs.map(doc => doc.data());
}

// TODO: Add similar functions for GA events, GTM events, conversions, etc.

module.exports = {
  initFirestore,
  writeMetaCampaign,
  getMetaCampaigns,
  // Add more exports as needed
}; 