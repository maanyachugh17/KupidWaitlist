// Complete 2FA Verification System for Kupid Waitlist
// Replace your entire Google Apps Script with this code

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ 
      result: "success", 
      message: "Kupid Waitlist API is running. Use POST to submit data." 
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function sendVerificationCode(phoneNumber, name) {
  try {
    // Your Twilio credentials - Replace with your actual values
    const TWILIO_ACCOUNT_SID = 'YOUR_TWILIO_ACCOUNT_SID';
    const TWILIO_AUTH_TOKEN = 'YOUR_TWILIO_AUTH_TOKEN';
    const TWILIO_PHONE_NUMBER = 'YOUR_TWILIO_PHONE_NUMBER';
    
    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
    // Store verification code temporarily
    const verificationData = {
      phone: phoneNumber,
      code: verificationCode,
      timestamp: new Date().getTime(),
      name: name
    };
    
    // Store in PropertiesService (Google Apps Script's simple storage)
    PropertiesService.getScriptProperties().setProperty(
      'verification_' + phoneNumber.replace(/\D/g, ''),
      JSON.stringify(verificationData)
    );
    
    // Send SMS via Twilio
    const message = `Your Kupid verification code is: ${verificationCode}. Valid for 10 minutes.`;
    
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const payload = {
      'To': phoneNumber,
      'From': TWILIO_PHONE_NUMBER,
      'Body': message
    };
    
    const options = {
      'method': 'post',
      'headers': {
        'Authorization': 'Basic ' + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN)
      },
      'payload': payload
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.sid) {
      console.log('Verification code sent to: ' + phoneNumber);
      return {
        success: true,
        message: 'Verification code sent!'
      };
    } else {
      throw new Error('Failed to send SMS');
    }
    
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

// Updated doPost function with 2FA
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
      
      if (name) name = name.trim();
      if (phone) phone = phone.trim();
      
      if (!name || !phone) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            result: "error", 
            message: "Name and phone are required" 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      var result = sendVerificationCode(phone, name);
      return ContentService.createTextOutput(
        JSON.stringify(result)
      ).setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'verify_code') {
      // Step 2: Verify the code
      var phone = e.parameter.phone;
      var code = e.parameter.code;
      
      if (phone) phone = phone.trim();
      if (code) code = code.trim();
      
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
      var timestamp = e.parameter.timestamp;
      var submissionId = e.parameter.submission_id;
      
      if (name) name = name.trim();
      if (phone) phone = phone.trim();
      
      if (!name || !phone) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            result: "error", 
            message: "Name and phone are required" 
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
      
      // Add to waitlist (existing logic)
      var newRowNumber = sheet.getLastRow() + 1;
      var phoneCell = sheet.getRange(newRowNumber, 3);
      phoneCell.setNumberFormat('@');
      
      sheet.getRange(newRowNumber, 1).setValue(timestamp || new Date());
      sheet.getRange(newRowNumber, 2).setValue(name);
      phoneCell.setValue(phone);
      
      console.log('New verified waitlist signup: ' + name + ' - ' + phone);
      
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

// Function to clean existing duplicates in Column C
function cleanExistingDuplicates() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('No data to clean');
      return;
    }
    
    var header = data[0];
    var rows = data.slice(1);
    
    // Track unique phone numbers in Column C (index 2)
    var seen = [];
    var uniqueRows = [];
    var duplicateCount = 0;
    
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var phone = String(row[2] || '').trim(); // Column C = index 2
      
      // Skip rows with #ERROR! or invalid phone data
      if (phone === '#ERROR!' || phone === '' || phone === 'undefined') {
        console.log('Skipping invalid phone entry: ' + phone);
        continue;
      }
      
      var normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
      
      // Check if we've seen this phone before
      var isUnique = true;
      for (var j = 0; j < seen.length; j++) {
        if (seen[j] === normalizedPhone) {
          isUnique = false;
          break;
        }
      }
      
      if (normalizedPhone && isUnique) {
        seen.push(normalizedPhone);
        uniqueRows.push(row);
      } else if (normalizedPhone) {
        duplicateCount++;
        console.log('Removing duplicate: ' + phone);
      }
    }
    
    // Clear sheet and rewrite with unique data
    sheet.clear();
    if (header.length > 0) {
      sheet.getRange(1, 1, 1, header.length).setValues([header]);
    }
    
    if (uniqueRows.length > 0) {
      sheet.getRange(2, 1, uniqueRows.length, header.length).setValues(uniqueRows);
      
      // Format Column C as text to prevent formula errors
      var phoneColumn = sheet.getRange(2, 3, uniqueRows.length, 1); // Column C
      phoneColumn.setNumberFormat('@'); // Format as text
    }
    
    console.log('Cleanup complete! Removed ' + duplicateCount + ' duplicates. ' + uniqueRows.length + ' unique entries remain.');
    
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
  }
}

// Function to fix ALL existing #ERROR! entries and format Column C
function fixAllPhoneErrors() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      console.log('No data to fix');
      return;
    }
    
    // First, format entire Column C as text
    var phoneColumn = sheet.getRange(1, 3, lastRow, 1); // Column C
    phoneColumn.setNumberFormat('@'); // Format as text
    
    // Get all data to check for #ERROR! entries
    var data = sheet.getDataRange().getValues();
    var fixedCount = 0;
    
    for (var i = 1; i < data.length; i++) { // Skip header
      if (String(data[i][2]) === '#ERROR!' || String(data[i][2]).indexOf('#') === 0) {
        // Clear the error cell and ask for manual re-entry
        sheet.getRange(i + 1, 3).clearContent();
        console.log('Cleared error in row ' + (i + 1) + '. Please manually re-enter the phone number.');
        fixedCount++;
      }
    }
    
    console.log('Fixed ' + fixedCount + ' phone errors. Column C is now formatted as text.');
    console.log('Please manually re-enter any cleared phone numbers.');
    
  } catch (error) {
    console.error('Error fixing phone formatting:', error);
  }
} 