const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc, doc, setDoc, limit } = require('firebase/firestore');

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
    console.error('Firebase config incomplete - cannot save transaction');
    return null;
  }

  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  }

  db = getFirestore();
  return db;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const callbackData = JSON.parse(event.body);
    
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const stkCallback = Body?.stkCallback;

    if (!stkCallback) {
      console.error('Invalid callback structure');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid callback data' }),
      };
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    const transactionUpdate = {
      merchantRequestId: MerchantRequestID,
      resultCode: ResultCode,
      resultDesc: ResultDesc,
      status: ResultCode === 0 ? 'success' : 'failed',
      updatedAt: new Date().toISOString(),
    };

    if (ResultCode === 0 && CallbackMetadata?.Item) {
      const items = CallbackMetadata.Item;
      items.forEach((item) => {
        switch (item.Name) {
          case 'Amount':
            transactionUpdate.amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            transactionUpdate.mpesaReceiptNumber = item.Value;
            break;
          case 'TransactionDate':
            transactionUpdate.transactionDate = item.Value?.toString();
            break;
          case 'PhoneNumber':
            transactionUpdate.phoneNumber = item.Value?.toString();
            break;
        }
      });
    }

    console.log('Processed transaction update:', transactionUpdate);

    const firebaseDb = getFirebaseDb();
    if (firebaseDb) {
      try {
        // 1) Save raw callback result for auditing
        const callbackResult = {
          checkoutRequestId: CheckoutRequestID,
          merchantRequestId: MerchantRequestID,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          status: ResultCode === 0 ? 'success' : 'failed',
          mpesaReceiptNumber: transactionUpdate.mpesaReceiptNumber || null,
          transactionDate: transactionUpdate.transactionDate || null,
          amount: transactionUpdate.amount || null,
          phoneNumber: transactionUpdate.phoneNumber || null,
          timestamp: new Date().toISOString(),
        };
        
        await setDoc(
          doc(firebaseDb, 'mpesa_callback_results', CheckoutRequestID),
          callbackResult
        );
        
        console.log('Callback result saved to mpesa_callback_results:', CheckoutRequestID);

        // 2) Update matching mpesa_transactions document
        try {
          // Try match by CheckoutRequestID first
          const txCol = collection(firebaseDb, 'mpesa_transactions');
          console.log('Searching for transaction with CheckoutRequestID:', CheckoutRequestID);
          let txQuery = query(txCol, where('checkoutRequestId', '==', CheckoutRequestID), limit(1));
          let txSnap = await getDocs(txQuery);
          console.log('Query by CheckoutRequestID found:', txSnap.size, 'documents');

          // If not found, try by MerchantRequestID
          if (txSnap.empty) {
            console.log('Searching for transaction with MerchantRequestID:', MerchantRequestID);
            txQuery = query(txCol, where('merchantRequestId', '==', MerchantRequestID), limit(1));
            txSnap = await getDocs(txQuery);
            console.log('Query by MerchantRequestID found:', txSnap.size, 'documents');
          }

          if (!txSnap.empty) {
            const txDoc = txSnap.docs[0];
            const txRef = doc(firebaseDb, 'mpesa_transactions', txDoc.id);
            await updateDoc(txRef, {
              status: ResultCode === 0 ? 'success' : 'failed',
              resultCode: ResultCode,
              resultDesc: ResultDesc,
              mpesaReceiptNumber: transactionUpdate.mpesaReceiptNumber || null,
              transactionDate: transactionUpdate.transactionDate || null,
              phoneNumber: transactionUpdate.phoneNumber || txDoc.data().phoneNumber || null,
              checkoutRequestId: CheckoutRequestID || txDoc.data().checkoutRequestId || null,
              merchantRequestId: MerchantRequestID || txDoc.data().merchantRequestId || null,
              updatedAt: new Date().toISOString(),
            });
            console.log('Transaction updated from callback:', txDoc.id);
          } else {
            console.warn('No matching transaction found to update for callback:', CheckoutRequestID, MerchantRequestID);
          }
        } catch (txUpdateErr) {
          console.error('Error updating transaction from callback:', txUpdateErr);
        }
      } catch (firebaseError) {
        console.error('Firebase callback result save error:', firebaseError);
      }
    } else {
      console.warn('Firebase not available - callback result not saved');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ResultCode: 0,
        ResultDesc: 'Success',
      }),
    };
  } catch (error) {
    console.error('Callback processing error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ResultCode: 1,
        ResultDesc: 'Failed',
      }),
    };
  }
};
