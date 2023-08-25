const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' })
      };
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing email in request body' })
      };
    }

    const MAILJET_API_KEY = process.env.MJ_API_KEY;
    const MAILJET_SECRET_KEY = process.env.MJ_SECRET_KEY;
    const MAILJET_LIST_ID = process.env.MJ_LIST_ID;

    const response = await axios.post(
      `https://api.mailjet.com/v3/REST/contactslist/${MAILJET_LIST_ID}/managecontact`,
      {
        Email: email,
        Action: 'addnoforce'
      },
      {
        auth: {
          username: MAILJET_API_KEY,
          password: MAILJET_SECRET_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: response.status,
      body: JSON.stringify({ message: 'Subscriber added successfully' })
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ message: 'An error occurred' })
    };
  }
};
