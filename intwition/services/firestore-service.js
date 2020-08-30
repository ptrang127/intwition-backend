const admin = require('firebase-admin');
//const serviceAccount = require('../api-keys/app-engine.json');
admin.initializeApp({
    credential: admin.credential.applicationDefault()
    //credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function readQuery(query) {
    console.log('Reading document');
    const queryDoc = db.collection('queries').doc(query);
    const doc = await queryDoc.get();
    if (!doc.exists) {
        console.log('Document not found');
    } else {
        console.log('Document found');
        console.log(doc.data());
    }
    return doc;
}

async function addQuery(query, sentiment) {
    console.log('Adding document');
    const docRef = db.collection('queries').doc(query);
    await docRef.set({
        query: query,
        sentiment: sentiment,
        timestamp: admin.firestore.Timestamp.now()
    });
    console.log('Document added');
}

async function updateQuery(query, sentiment) {
    console.log('Updating document');
    const docRef = db.collection('queries').doc(query);
    await docRef.update({
        query: query,
        sentiment: sentiment,
        timestamp: admin.firestore.Timestamp.now()
    });
    console.log('Document updated');
}

module.exports = {
    readQuery: readQuery,
    addQuery: addQuery,
    updateQuery: updateQuery
}