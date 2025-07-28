// FREE 2FA Verification System for Kupid Waitlist
// Uses Email instead of SMS - 100% FREE!

function sendVerificationCode(phoneNumber, name, email) {
  try {
    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
    // Store verification code temporarily
    const verificationData = {
      phone: phoneNumber,
      email: email,
      code: verificationCode,
      timestamp: new Date().getTime(),
      name: name
    };
    
    // Store in PropertiesService (Google Apps Script's free storage)
    PropertiesService.getScriptProperties().setProperty(
      'verification_' + phoneNumber.replace(/\D/g, ''),
      JSON.stringify(verificationData)
    );
    
    // Send email via Gmail API (FREE!)
    const subject = "Your Kupid Verification Code";
    const message = `
Hi ${name}! 👋

Your Kupid verification code is: **${verificationCode}**

This code is valid for 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
The Kupid Team 💕
    `;
    
    // Send email using Gmail API
    GmailApp.sendEmail(email, subject, message, {
      name: "Kupid Waitlist",
      replyTo: "noreply@kupid.com"
    });
    
    console.log('Verification code sent to: ' + email);
    return {
      success: true,
      message: 'Verification code sent to your email!'
    };
    
  } catch (error) {
    console.error('Error sending verification code:', error);
    return {
      success: false,
      message: 'Failed to send verification code. Please try again.'
    };
  }
}

function verifyCode(phoneNumber, submittedCode) {
  try {
    // Get stored verification data
    const storedData = PropertiesService.getScriptProperties().getProperty(
      'verification_' + phoneNumber.replace(/\D/g, '')
    );
    
    if (!storedData) {
      return {
        success: false,
        message: 'No verification code found. Please request a new one.'
      };
    }
    
    const verificationData = JSON.parse(storedData);
    const now = new Date().getTime();
    const timeLimit = 10 * 60 * 1000; // 10 minutes
    
    // Check if code is expired
    if (now - verificationData.timestamp > timeLimit) {
      // Clean up expired code
      PropertiesService.getScriptProperties().deleteProperty(
        'verification_' + phoneNumber.replace(/\D/g, '')
      );
      return {
        success: false,
        message: 'Verification code expired. Please request a new one.'
      };
    }
    
    // Check if code matches
    if (verificationData.code.toString() === submittedCode.toString()) {
      // Clean up verification data
      PropertiesService.getScriptProperties().deleteProperty(
        'verification_' + phoneNumber.replace(/\D/g, '')
      );
      
      return {
        success: true,
        message: 'Phone number verified successfully!'
      };
    } else {
      return {
        success: false,
        message: 'Invalid verification code. Please try again.'
      };
    }
    
  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      message: 'Error verifying code. Please try again.'
    };
  }
}

// Updated doPost function with FREE 2FA
function doPost(e) {
  try {
    // Check if we have parameters
    if (!e || !e.parameter) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "error", 
          message: "No parameters provided" 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    var action = e.parameter.action; // 'send_code', 'verify_code', 'submit_waitlist'
    var sheet = SpreadsheetApp.getActiveSheet();
    
    if (action === 'send_code') {
      // Step 1: Send verification code
      var name = e.parameter.name;
      var phone = e.parameter.phone;
      var email = e.parameter.email;
      
      if (!name || !phone || !email) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            result: "error", 
            message: "Name, phone, and email are required" 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Basic email validation
      if (!email.includes('@') || !email.includes('.')) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            result: "error", 
            message: "Please enter a valid email address" 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      var result = sendVerificationCode(phone, name, email);
      return ContentService.createTextOutput(
        JSON.stringify(result)
      ).setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'verify_code') {
      // Step 2: Verify the code
      var phone = e.parameter.phone;
      var code = e.parameter.code;
      
      if (!phone || !code) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            result: "error", 
            message: "Phone and verification code are required" 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      var result = verifyCode(phone, code);
      return ContentService.createTextOutput(
        JSON.stringify(result)
      ).setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'submit_waitlist') {
      // Step 3: Final submission (after verification)
      var name = e.parameter.name;
      var phone = e.parameter.phone;
      var email = e.parameter.email;
      var timestamp = e.parameter.timestamp;
      var submissionId = e.parameter.submission_id;
      
      if (!name || !phone || !email) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            result: "error", 
            message: "Name, phone, and email are required" 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Check for duplicates (existing logic)
      var normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
      var data = sheet.getDataRange().getValues();
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][2]) {
          var existingPhone = String(data[i][2]).replace(/[\s\-\(\)]/g, '');
          if (existingPhone === normalizedPhone) {
            return ContentService.createTextOutput(
              JSON.stringify({ 
                result: "error", 
                message: "This phone number is already registered!" 
              })
            ).setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
      
      // Add to waitlist with email column
      var newRowNumber = sheet.getLastRow() + 1;
      var phoneCell = sheet.getRange(newRowNumber, 3);
      var emailCell = sheet.getRange(newRowNumber, 4);
      phoneCell.setNumberFormat('@');
      emailCell.setNumberFormat('@');
      
      sheet.getRange(newRowNumber, 1).setValue(timestamp || new Date());
      sheet.getRange(newRowNumber, 2).setValue(name);
      phoneCell.setValue(phone);
      emailCell.setValue(email);
      
      console.log('New verified waitlist signup: ' + name + ' - ' + phone + ' - ' + email);
      
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "success",
          message: "Successfully added to waitlist!" 
        })
      ).setMimeType(ContentService.MimeType.JSON);
      
    } else {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "error", 
          message: "Invalid action" 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "error", 
        message: "Server error: " + error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Keep your existing functions
function doGet(e) { 
  return ContentService.createTextOutput( 
    JSON.stringify({ 
      result: "success", 
      message: "Kupid Waitlist API is running. Use POST to submit data." 
    }) 
  ).setMimeType(ContentService.MimeType.JSON); 
} 