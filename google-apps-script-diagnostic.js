// Add this to your existing Google Apps Script

// 🔍 Diagnostic function - run this to see what's in Column C
function inspectColumnC() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    console.log('=== COLUMN C INSPECTION ===');
    console.log('Total rows: ' + data.length);
    
    for (var i = 0; i < Math.min(data.length, 10); i++) { // Show first 10 rows
      var cellValue = data[i][2]; // Column C
      var cellType = typeof cellValue;
      var cellString = String(cellValue);
      
      console.log('Row ' + (i + 1) + ': "' + cellString + '" (Type: ' + cellType + ')');
    }
    
    // Count different types of entries
    var errorCount = 0;
    var validPhones = 0;
    var emptyCount = 0;
    
    for (var i = 1; i < data.length; i++) { // Skip header
      var cellValue = String(data[i][2] || '');
      
      if (cellValue === '' || cellValue === 'undefined') {
        emptyCount++;
      } else if (cellValue.indexOf('#') === 0 || cellValue === '#ERROR!') {
        errorCount++;
      } else {
        validPhones++;
      }
    }
    
    console.log('=== SUMMARY ===');
    console.log('Empty cells: ' + emptyCount);
    console.log('Error cells: ' + errorCount);
    console.log('Valid phones: ' + validPhones);
    
  } catch (error) {
    console.error('Error inspecting column:', error);
  }
}

// 🛠️ Better function to handle phone formatting without data loss
function smartFormatPhones() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      console.log('No data to format');
      return;
    }
    
    // Format entire Column C as text first
    var phoneColumn = sheet.getRange(1, 3, lastRow, 1);
    phoneColumn.setNumberFormat('@');
    
    // Get current data
    var data = sheet.getDataRange().getValues();
    var fixedCount = 0;
    
    // Go through each phone cell
    for (var i = 1; i < data.length; i++) { // Skip header
      var currentValue = data[i][2];
      var cellRange = sheet.getRange(i + 1, 3); // Row i+1, Column C
      
      // Only process if there's a value
      if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
        var valueString = String(currentValue);
        
        // If it's a number that got interpreted as formula, try to preserve it
        if (typeof currentValue === 'number') {
          // Convert number back to phone format
          var phoneStr = '+1 ' + String(currentValue);
          cellRange.setValue(phoneStr);
          console.log('Row ' + (i + 1) + ': Converted number ' + currentValue + ' to ' + phoneStr);
          fixedCount++;
        } else if (valueString.indexOf('#') === 0) {
          // This is an error - can't recover original data
          console.log('Row ' + (i + 1) + ': Found error "' + valueString + '" - cannot recover original data');
        } else {
          // Re-set the value to ensure it's text
          cellRange.setValue(valueString);
        }
      }
    }
    
    console.log('Smart formatting complete! Processed ' + fixedCount + ' phone numbers.');
    console.log('Column C is now formatted as text.');
    
  } catch (error) {
    console.error('Error in smart formatting:', error);
  }
}

// 🔄 Function to restore deleted phone numbers (if you have backup data)
function restorePhoneNumbers() {
  // You would need to manually provide the phone numbers that got deleted
  // This is just a template - you'd need to fill in the actual data
  
  var phoneNumbersToRestore = [
    // Add your deleted phone numbers here like:
    // {row: 2, phone: '+1 555-1234'},
    // {row: 3, phone: '+1 555-5678'},
  ];
  
  if (phoneNumbersToRestore.length === 0) {
    console.log('No phone numbers provided to restore.');
    console.log('Please edit this function and add the deleted phone numbers.');
    return;
  }
  
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    
    for (var i = 0; i < phoneNumbersToRestore.length; i++) {
      var entry = phoneNumbersToRestore[i];
      var cellRange = sheet.getRange(entry.row, 3); // Column C
      
      // Format as text first
      cellRange.setNumberFormat('@');
      // Then set the phone number
      cellRange.setValue(entry.phone);
      
      console.log('Restored row ' + entry.row + ': ' + entry.phone);
    }
    
    console.log('Restoration complete!');
    
  } catch (error) {
    console.error('Error restoring phone numbers:', error);
  }
} 