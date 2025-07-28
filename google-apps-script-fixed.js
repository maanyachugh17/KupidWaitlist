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
    
    // Get parameters (fixed for older JavaScript)
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
    
    // Duplicate Prevention Logic
    // Normalize phone number for comparison (remove spaces, dashes, parentheses)
    var normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Get all existing phone numbers from the sheet
    var data = sheet.getDataRange().getValues();
    var existingPhones = [];
    
    // Extract phone numbers from existing data (phone is in column 3)
    for (var i = 1; i < data.length; i++) { // Start from row 1 to skip headers
      if (data[i][2]) { // Column 3 = phone column
        var existingPhone = String(data[i][2]).replace(/[\s\-\(\)]/g, '');
        existingPhones.push(existingPhone);
      }
    }
    
    // Check if this phone number already exists
    for (var j = 0; j < existingPhones.length; j++) {
      if (existingPhones[j] === normalizedPhone) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            result: "error", 
            message: "This phone number is already registered!" 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Timestamp', 'Name', 'Phone', 'Submission ID', 'Date Added']
      ]);
    }
    
    // Add new entry with enhanced data
    var currentTime = new Date();
    sheet.appendRow([
      timestamp || currentTime.toISOString(),
      name,
      phone,
      submissionId || ('manual-' + Date.now()),
      currentTime
    ]);
    
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

// Function to clean existing duplicates
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
    
    // Track unique phone numbers
    var seen = [];
    var uniqueRows = [];
    var duplicateCount = 0;
    
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var phone = String(row[2] || '').trim(); // Column 3 = phone
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
    }
    
    console.log('Cleanup complete! Removed ' + duplicateCount + ' duplicates. ' + uniqueRows.length + ' unique entries remain.');
    
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
  }
} 