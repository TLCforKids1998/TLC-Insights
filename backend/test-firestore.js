const admin = require('firebase-admin');
const path = require('path');

async function testFirestoreConnection() {
  try {
    // Initialize Firestore
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
    });
    const db = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully.');

    // Write a test document
    const docRef = db.collection('test_collection').doc('test_doc');
    const testData = {
      status: 'OK',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await docRef.set(testData);
    console.log('Successfully wrote test document to Firestore.');

    // Read the test document
    const snapshot = await docRef.get();
    if (snapshot.exists) {
      console.log('Successfully read test document:', snapshot.data());
      console.log('✅ Firestore connection test PASSED.');
    } else {
      throw new Error('Test document not found after writing.');
    }

    // Clean up the test document
    await docRef.delete();
    console.log('Cleaned up test document.');

  } catch (error) {
    console.error('❌ Firestore connection test FAILED:');
    console.error(error);
    process.exit(1);
  }
}

testFirestoreConnection(); 