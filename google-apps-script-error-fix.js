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
    
    // 🔧 FIX: Get next row and format Column C as TEXT BEFORE adding data
    var newRowNumber = sheet.getLastRow() + 1;
    
    // Format the phone cell as text FIRST to prevent formula interpretation
    var phoneCell = sheet.getRange(newRowNumber, 3); // Column C
    phoneCell.setNumberFormat('@'); // Format as text BEFORE setting value
    
    // Add the timestamp and name first
    sheet.getRange(newRowNumber, 1).setValue(timestamp || new Date());
    sheet.getRange(newRowNumber, 2).setValue(name);
    
    // Now set the phone number as text (this prevents #ERROR!)
    phoneCell.setValue(phone);
    
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