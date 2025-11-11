const axios = require('axios');
const { getOAuthToken, formatPhoneNumber } = require('./mpesa-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { phoneNumber, amount, serviceType, actionType, userId } = JSON.parse(event.body);

    if (!phoneNumber || !amount || !serviceType || !actionType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const { MPESA_BASE_URL, MPESA_SHORTCODE, MPESA_PASSKEY } = process.env;
    const token = await getOAuthToken();
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const callbackUrl = `${event.headers.origin || 'https://allotmealafroc.netlify.app'}/.netlify/functions/callback`;

    const requestData = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.floor(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `${serviceType}-${actionType}`,
      TransactionDesc: `Payment for ${serviceType} ${actionType}`,
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: response.data,
        timestamp,
      }),
    };
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error.response?.data || error.message,
      }),
    };
  }
};
