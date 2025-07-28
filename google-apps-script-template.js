// Copy this ENTIRE code into your Google Apps Script editor
// Replace the placeholder credentials with your actual Twilio credentials

function doGet(e) {
  var output = ContentService.createTextOutput(
    JSON.stringify({
      result: "success",
      message: "Kupid Waitlist API is running. Use POST to submit data."
    })
  );
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doPost(e) {
  try {
    // Check if we have parameters
    if (!e || !e.parameter) {
      var errorOutput = ContentService.createTextOutput(
        JSON.stringify({ result: "error", message: "No parameters provided" })
      );
      errorOutput.setMimeType(ContentService.MimeType.JSON);
      return errorOutput;
    }

    var action = e.parameter.action;

    if (action === 'send_code') {
      return handleSendCode(e);
    } else if (action === 'verify_code') {
      return handleVerifyCode(e);
    } else if (action === 'submit_waitlist') {
      return handleSubmitWaitlist(e);
    } else {
      var invalidOutput = ContentService.createTextOutput(
        JSON.stringify({ result: "error", message: "Invalid action" })
      );
      invalidOutput.setMimeType(ContentService.MimeType.JSON);
      return invalidOutput;
    }
  } catch (error) {
    var errorOutput = ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "Server error: " + error.toString() })
    );
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

function handleSendCode(e) {
  try {
    var name = e.parameter.name;
    var phone = e.parameter.phone;

    if (!name || !phone) {
      var errorOutput = ContentService.createTextOutput(
        JSON.stringify({ success: false, message: "Name and phone are required" })
      );
      errorOutput.setMimeType(ContentService.MimeType.JSON);
      return errorOutput;
    }

    var result = sendVerificationCode(phone, name);
    var output = ContentService.createTextOutput(JSON.stringify(result));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (error) {
    var errorOutput = ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "Error sending code: " + error.toString() })
    );
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

function handleVerifyCode(e) {
  try {
    var phone = e.parameter.phone;
    var code = e.parameter.code;

    if (!phone || !code) {
      var errorOutput = ContentService.createTextOutput(
        JSON.stringify({ success: false, message: "Phone and code are required" })
      );
      errorOutput.setMimeType(ContentService.MimeType.JSON);
      return errorOutput;
    }

    var result = verifyCode(phone, code);
    var output = ContentService.createTextOutput(JSON.stringify(result));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (error) {
    var errorOutput = ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "Error verifying code: " + error.toString() })
    );
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

function handleSubmitWaitlist(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var name = e.parameter.name;
    var phone = e.parameter.phone;
    var timestamp = e.parameter.timestamp;
    var submissionId = e.parameter.submission_id;

    if (!name || !phone) {
      var errorOutput = ContentService.createTextOutput(
        JSON.stringify({ result: "error", message: "Name and phone are required" })
      );
      errorOutput.setMimeType(ContentService.MimeType.JSON);
      return errorOutput;
    }

    // Trim whitespace
    if (name) name = name.trim();
    if (phone) phone = phone.trim();

    // Duplicate Prevention Logic - Check Column C (index 2) for phone numbers
    var normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    var data = sheet.getDataRange().getValues();

    // Check Column C (index 2) for existing phone numbers
    for (var i = 1; i < data.length; i++) {
      if (data[i][2]) {
        var existingPhone = String(data[i][2]).replace(/[\s\-\(\)]/g, '');
        if (existingPhone === normalizedPhone) {
          var errorOutput = ContentService.createTextOutput(
            JSON.stringify({ result: "error", message: "This phone number is already registered!" })
          );
          errorOutput.setMimeType(ContentService.MimeType.JSON);
          return errorOutput;
        }
      }
    }

    // Add to sheet
    var newRowNumber = sheet.getLastRow() + 1;
    var phoneCell = sheet.getRange(newRowNumber, 3);
    phoneCell.setNumberFormat('@');

    sheet.getRange(newRowNumber, 1).setValue(timestamp || new Date());
    sheet.getRange(newRowNumber, 2).setValue(name);
    phoneCell.setValue(phone);

    console.log('New waitlist signup: ' + name + ' - ' + phone);

    var output = ContentService.createTextOutput(
      JSON.stringify({ result: "success", message: "Successfully added to waitlist!" })
    );
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (error) {
    var errorOutput = ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "Server error: " + error.toString() })
    );
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

function sendVerificationCode(phoneNumber, name) {
  try {
    // REPLACE THESE WITH YOUR ACTUAL TWILIO CREDENTIALS
    const TWILIO_ACCOUNT_SID = 'YOUR_TWILIO_ACCOUNT_SID_HERE';
    const TWILIO_AUTH_TOKEN = 'YOUR_TWILIO_AUTH_TOKEN_HERE';
    const TWILIO_PHONE_NUMBER = 'YOUR_TWILIO_PHONE_NUMBER_HERE';

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Store verification code temporarily
    const verificationData = {
      phone: phoneNumber,
      code: verificationCode,
      timestamp: new Date().getTime(),
      name: name
    };

    // Store in PropertiesService
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
      return { success: true, message: 'Verification code sent!' };
    } else {
      throw new Error('Failed to send SMS');
    }
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, message: 'Failed to send verification code. Please try again.' };
  }
}

function verifyCode(phoneNumber, submittedCode) {
  try {
    // Get stored verification data
    const storedData = PropertiesService.getScriptProperties().getProperty(
      'verification_' + phoneNumber.replace(/\D/g, '')
    );

    if (!storedData) {
      return { success: false, message: 'No verification code found. Please request a new one.' };
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
      return { success: false, message: 'Verification code expired. Please request a new one.' };
    }

    // Check if code matches
    if (verificationData.code.toString() === submittedCode.toString()) {
      // Clean up verification data
      PropertiesService.getScriptProperties().deleteProperty(
        'verification_' + phoneNumber.replace(/\D/g, '')
      );
      return { success: true, message: 'Phone number verified successfully!' };
    } else {
      return { success: false, message: 'Invalid verification code. Please try again.' };
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, message: 'Error verifying code. Please try again.' };
  }
}

// Utility functions
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
    var seen = [];
    var uniqueRows = [];
    var duplicateCount = 0;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var phone = String(row[2] || '').trim();

      if (phone === '#ERROR!' || phone === '' || phone === 'undefined') {
        console.log('Skipping invalid phone entry: ' + phone);
        continue;
      }

      var normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
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

    sheet.clear();
    if (header.length > 0) {
      sheet.getRange(1, 1, 1, header.length).setValues([header]);
    }
    if (uniqueRows.length > 0) {
      sheet.getRange(2, 1, uniqueRows.length, header.length).setValues(uniqueRows);
      var phoneColumn = sheet.getRange(2, 3, uniqueRows.length, 1);
      phoneColumn.setNumberFormat('@');
    }

    console.log('Cleanup complete! Removed ' + duplicateCount + ' duplicates. ' + uniqueRows.length + ' unique entries remain.');
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
  }
} 