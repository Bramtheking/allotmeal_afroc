const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc, doc } = require('firebase/firestore');

let db = null;

function getFirebaseDb() {
  if (db) return db;

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!firebaseConfig.projectId) {
    console.error('Firebase config incomplete - cannot access database');
    return null;
  }

  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  }

  db = getFirestore();
  return db;
}

exports.handler = async (event) => {
  console.log('Running advertisement expiration check...');

  try {
    const firebaseDb = getFirebaseDb();
    if (!firebaseDb) {
      throw new Error('Firebase not available');
    }

    const now = new Date().toISOString();
    
    // Query for active advertisements with autoExpires enabled
    const adsCol = collection(firebaseDb, 'advertisements');
    const activeAdsQuery = query(
      adsCol,
      where('status', '==', 'active'),
      where('autoExpires', '==', true)
    );

    const snapshot = await getDocs(activeAdsQuery);
    console.log(`Found ${snapshot.size} active auto-expiring advertisements`);

    let expiredCount = 0;
    const updatePromises = [];

    snapshot.forEach((docSnap) => {
      const adData = docSnap.data();
      const endDate = adData.endDate;

      // Check if advertisement has expired
      if (endDate && endDate < now) {
        console.log(`Expiring advertisement: ${docSnap.id} (${adData.title})`);
        
        const adRef = doc(firebaseDb, 'advertisements', docSnap.id);
        updatePromises.push(
          updateDoc(adRef, {
            status: 'expired',
            updatedAt: now,
          })
        );
        expiredCount++;
      }
    });

    // Execute all updates
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`Successfully expired ${expiredCount} advertisements`);
    } else {
      console.log('No advertisements to expire');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: `Checked ${snapshot.size} advertisements, expired ${expiredCount}`,
        expiredCount,
        timestamp: now,
      }),
    };
  } catch (error) {
    console.error('Advertisement expiration error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
