# 🔧 Fix Your Google Apps Script Deployment

## The Problem
Your Google Apps Script is returning "Page Not Found" errors, which means the deployment isn't working correctly.

## Step-by-Step Fix

### 1. Open Your Google Apps Script
- Go to [script.google.com](https://script.google.com)
- Open your Kupid Waitlist project

### 2. Replace ALL Code
- Delete everything in your Google Apps Script editor
- Copy the ENTIRE code from `google-apps-script-template.js` in your project
- Paste it into your Google Apps Script editor

### 3. Add Your Twilio Credentials
In the `sendVerificationCode` function, replace these lines:
```javascript
const TWILIO_ACCOUNT_SID = 'YOUR_TWILIO_ACCOUNT_SID_HERE';
const TWILIO_AUTH_TOKEN = 'YOUR_TWILIO_AUTH_TOKEN_HERE';
const TWILIO_PHONE_NUMBER = 'YOUR_TWILIO_PHONE_NUMBER_HERE';
```

With your actual credentials (replace with your own):
```javascript
const TWILIO_ACCOUNT_SID = 'YOUR_ACTUAL_SID';
const TWILIO_AUTH_TOKEN = 'YOUR_ACTUAL_TOKEN';
const TWILIO_PHONE_NUMBER = 'YOUR_ACTUAL_PHONE';
```

### 4. Save the Script
- Click "Save" (Ctrl+S or Cmd+S)

### 5. Create NEW Deployment
- Click **"Deploy"** → **"New deployment"**
- Choose **"Web app"**
- Set these exact settings:
  - **Execute as:** "Me"
  - **Who has access:** "Anyone with a Google account"
- Click **"Deploy"**
- **Copy the NEW URL** that Google gives you

### 6. Test Your Deployment
- Open `test-google-apps-script.html` in your browser
- Click "Test GET Request" - should show success message
- Click "Test POST Request" - should show success or error details

### 7. Update Your React Code
- Once you have the NEW deployment URL, I'll help you update the React code

## Common Issues

### "Page Not Found" Error
- This means the deployment URL is wrong or the script isn't deployed
- Create a NEW deployment with the correct settings

### "Authentication Required" Error
- This means the deployment settings require sign-in
- Make sure "Who has access" is set to "Anyone with a Google account"

### "Script Error" 
- Check that you copied the template code exactly
- Make sure your Twilio credentials are correct
- Check the Google Apps Script logs for detailed error messages

## Test Your Fix
1. Open `test-google-apps-script.html` in your browser
2. Test both GET and POST requests
3. If they work, your Google Apps Script is fixed!
4. If they don't work, check the error messages and try again

Let me know what happens when you test it! 