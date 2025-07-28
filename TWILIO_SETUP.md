# 📱 Twilio SMS Setup Guide for Kupid Waitlist

## 🚀 **Step 1: Create Twilio Account**
1. Go to [twilio.com](https://twilio.com)
2. Click "Sign up for free"
3. Fill in your details
4. Verify your email and phone number
5. **You get $15-20 free credit!** (enough for ~2,000 SMS)

## 🔑 **Step 2: Get Your Credentials**
1. Go to [console.twilio.com](https://console.twilio.com)
2. On the dashboard, you'll see:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click "show" to reveal)
3. Copy both values

## 📞 **Step 3: Get a Phone Number**
1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Active numbers**
2. Click **"Get a trial number"**
3. Choose a number (any country works)
4. Copy the phone number (e.g., +1234567890)

## ⚙️ **Step 4: Update Google Apps Script**
1. Open your Google Apps Script project
2. Replace the code with `verification-system.js`
3. Update these lines with your actual values:
   ```javascript
   const TWILIO_ACCOUNT_SID = 'AC1234567890abcdef...'; // Your actual SID
   const TWILIO_AUTH_TOKEN = 'your_actual_auth_token_here';
   const TWILIO_PHONE_NUMBER = '+1234567890'; // Your Twilio number
   ```
4. Save and deploy

## 🎯 **Step 5: Test It**
1. Deploy your updated script
2. Test with your own phone number
3. You should receive an SMS with a 6-digit code

## 💰 **Costs:**
- **Free Trial**: $15-20 credit included
- **After Trial**: ~$0.0075 per SMS
- **100 SMS**: ~$0.75
- **1000 SMS**: ~$7.50

## 🔧 **Troubleshooting:**
- **"Authentication failed"**: Check your SID and Auth Token
- **"Invalid phone number"**: Make sure to include country code (+1 for US)
- **"Quota exceeded"**: Upgrade your Twilio account

## 📋 **What You Get:**
✅ Professional SMS verification  
✅ 6-digit codes with 10-minute expiry  
✅ Duplicate prevention  
✅ Mobile-friendly interface  
✅ Loading states and error handling  

## 🎉 **Ready to Deploy!**
Once you've updated the credentials, your 2FA system will be live! 