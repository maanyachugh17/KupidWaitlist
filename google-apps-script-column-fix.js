function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ 
      result: "success", 
      message: "Kupid Waitlist API is running. Use POST to submit data." 
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

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
    
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Get parameters
    var name = e.parameter.name;
    var phone = e.parameter.phone;
    var timestamp = e.parameter.timestamp;
    var submissionId = e.parameter.submission_id;
    
    // Trim whitespace manually
    if (name) name = name.trim();
    if (phone) phone = phone.trim();
    
    // Validate data
    if (!name || !phone) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "error", 
          message: "Name and phone are required" 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Duplicate Prevention Logic - Check Column C (index 2) for phone numbers
    var normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Get all existing data from the sheet
    var data = sheet.getDataRange().getValues();
    
    // Check Column C (index 2) for existing phone numbers
    for (var i = 1; i < data.length; i++) { // Start from row 1 to skip headers
      if (data[i][2]) { // Column C = index 2
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
    
    // Add new entry - your current format appears to be: Timestamp, Name, Phone
    var currentTime = new Date();
    sheet.appendRow([
      timestamp || currentTime.toISOString(),
      name,
      phone
    ]);
    
    // Fix phone formatting in Column C to prevent formula errors
    var newRowNumber = sheet.getLastRow();
    var phoneCell = sheet.getRange(newRowNumber, 3); // Column C
    phoneCell.setNumberFormat('@'); // Format as text
    phoneCell.setValue(phone); // Set as text to prevent formula errors
    
    // Log successful submission
    console.log('New waitlist signup: ' + name + ' - ' + phone);
    
    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "success",
        message: "Successfully added to waitlist!" 
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error processing form submission:', error);
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

// Function to fix Column C phone formatting
function fixPhoneFormatting() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    
    if (sheet.getLastRow() <= 1) {
      console.log('No data to fix');
      return;
    }
    
    // Format entire Column C as text
    var phoneColumn = sheet.getRange(1, 3, sheet.getLastRow(), 1); // Column C
    phoneColumn.setNumberFormat('@'); // @ means text format
    
    console.log('Column C phone formatting fixed! All phone numbers are now formatted as text.');
    
  } catch (error) {
    console.error('Error fixing phone formatting:', error);
  }
} 