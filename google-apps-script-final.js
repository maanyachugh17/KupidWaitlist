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
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Timestamp', 'Name', 'Phone', 'Submission ID', 'Date Added']
      ]);
    }
    
    // Duplicate Prevention Logic
    // Normalize phone number for comparison (remove spaces, dashes, parentheses)
    var normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Get all existing data from the sheet
    var data = sheet.getDataRange().getValues();
    
    // Check existing phone numbers - find the phone column dynamically
    var phoneColumnIndex = -1;
    if (data.length > 0) {
      var headers = data[0];
      for (var h = 0; h < headers.length; h++) {
        if (headers[h] === 'Phone') {
          phoneColumnIndex = h;
          break;
        }
      }
      
      // If no header found, assume phone is in column 3 (index 2)
      if (phoneColumnIndex === -1) phoneColumnIndex = 2;
    }
    
    // Check for duplicates
    for (var i = 1; i < data.length; i++) { // Start from row 1 to skip headers
      if (data[i][phoneColumnIndex]) {
        var existingPhone = String(data[i][phoneColumnIndex]).replace(/[\s\-\(\)]/g, '');
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
    
    // Prepare data for insertion
    var currentTime = new Date();
    var rowData = [
      timestamp || currentTime.toISOString(),
      name,
      phone, // We'll format this as text below
      submissionId || ('manual-' + Date.now()),
      currentTime
    ];
    
    // Add new row
    var newRowNumber = sheet.getLastRow() + 1;
    sheet.getRange(newRowNumber, 1, 1, rowData.length).setValues([rowData]);
    
    // 🔧 FIX: Format phone number as TEXT to prevent formula errors
    var phoneCell = sheet.getRange(newRowNumber, 3); // Column 3 = Phone
    phoneCell.setNumberFormat('@'); // @ means text format
    phoneCell.setValue(phone); // Set as text
    
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

// Function to clean existing duplicates AND fix phone formatting
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
    
    // Find phone column
    var phoneColumnIndex = -1;
    for (var h = 0; h < header.length; h++) {
      if (header[h] === 'Phone') {
        phoneColumnIndex = h;
        break;
      }
    }
    if (phoneColumnIndex === -1) phoneColumnIndex = 2; // Default to column 3
    
    // Track unique phone numbers
    var seen = [];
    var uniqueRows = [];
    var duplicateCount = 0;
    
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var phone = String(row[phoneColumnIndex] || '').trim();
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
      }
    }
    
    // Clear sheet and rewrite with unique data
    sheet.clear();
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    
    if (uniqueRows.length > 0) {
      sheet.getRange(2, 1, uniqueRows.length, header.length).setValues(uniqueRows);
      
      // Format phone column as text to prevent formula errors
      var phoneColumn = sheet.getRange(2, phoneColumnIndex + 1, uniqueRows.length, 1);
      phoneColumn.setNumberFormat('@'); // Format as text
    }
    
    console.log('Cleanup complete! Removed ' + duplicateCount + ' duplicates. ' + uniqueRows.length + ' unique entries remain.');
    
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
  }
}

// Function to fix all existing phone number formatting
function fixPhoneFormatting() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('No data to fix');
      return;
    }
    
    // Find phone column
    var phoneColumnIndex = -1;
    var header = data[0];
    for (var h = 0; h < header.length; h++) {
      if (header[h] === 'Phone') {
        phoneColumnIndex = h;
        break;
      }
    }
    if (phoneColumnIndex === -1) phoneColumnIndex = 2; // Default to column 3
    
    // Format entire phone column as text
    var phoneColumn = sheet.getRange(1, phoneColumnIndex + 1, sheet.getLastRow(), 1);
    phoneColumn.setNumberFormat('@'); // @ means text format
    
    console.log('Phone formatting fixed! All phone numbers are now formatted as text.');
    
  } catch (error) {
    console.error('Error fixing phone formatting:', error);
  }
} 