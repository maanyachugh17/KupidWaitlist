// CREDENTIALS TEMPLATE
// Copy this file to credentials.js and fill in your actual Twilio credentials

const TWILIO_CREDENTIALS = {
  ACCOUNT_SID: 'YOUR_ACTUAL_ACCOUNT_SID_HERE', // Replace with your actual Account SID
  AUTH_TOKEN: 'YOUR_ACTUAL_AUTH_TOKEN_HERE', // Replace with your actual Auth Token
  PHONE_NUMBER: 'YOUR_ACTUAL_PHONE_NUMBER_HERE' // Replace with your actual Twilio phone number
};

// Instructions:
// 1. Copy this file and rename it to credentials.js
// 2. Replace the placeholder values with your actual Twilio credentials
// 3. Update your Google Apps Script to use these values
// 4. Never commit credentials.js to git (it's in .gitignore)

module.exports = TWILIO_CREDENTIALS; 