// Copy this ENTIRE code into your Google Apps Script editor
// This is a simple waitlist form handler without 2FA

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

    var sheet = SpreadsheetApp.getActiveSheet();
    var name = e.parameter.name;
    var phone = e.parameter.phone;
    var timestamp = e.parameter.timestamp;
    var submissionId = e.parameter.submission_id;

    // Validate data
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