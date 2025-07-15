// Google Apps Script for Kupid Waitlist - Duplicate Prevention
// Copy this code to your Google Apps Script project: https://script.google.com

function doPost(e) {
  try {
    // Get form parameters
    const name = e.parameter.name?.trim();
    const phone = e.parameter.phone?.trim();
    const timestamp = e.parameter.timestamp;
    const submissionId = e.parameter.submission_id;
    
    // Validate required fields
    if (!name || !phone) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: 'error',
          message: 'Name and phone are required'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the spreadsheet (replace with your spreadsheet ID)
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace this!
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Normalize phone number for duplicate checking
    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check for existing phone numbers (search column B assuming phone is in column 2)
    const phoneColumn = sheet.getRange('B:B').getValues().flat();
    const existingNormalized = phoneColumn.map(p => 
      String(p).replace(/[\s\-\(\)]/g, '')
    );
    
    // Check if phone already exists
    if (existingNormalized.includes(normalizedPhone)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: 'error',
          message: 'This phone number is already registered!'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Name', 'Phone', 'Timestamp', 'Submission ID', 'Date Added']
      ]);
    }
    
    // Add new row
    const newRow = [
      name,
      phone,
      timestamp || new Date().toISOString(),
      submissionId || `manual-${Date.now()}`,
      new Date()
    ];
    
    sheet.appendRow(newRow);
    
    // Log successful submission
    console.log(`New waitlist signup: ${name} - ${phone}`);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        message: 'Successfully added to waitlist!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error',
        message: 'Server error. Please try again later.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to clean existing duplicates
function cleanExistingDuplicates() {
  try {
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace this!
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      console.log('No data to clean');
      return;
    }
    
    const header = data[0];
    const rows = data.slice(1);
    
    // Track unique phone numbers
    const seen = new Set();
    const uniqueRows = [];
    let duplicateCount = 0;
    
    for (const row of rows) {
      const phone = String(row[1] || '').trim();
      const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
      
      if (normalizedPhone && !seen.has(normalizedPhone)) {
        seen.add(normalizedPhone);
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
    
    console.log(`Cleanup complete! Removed ${duplicateCount} duplicates. ${uniqueRows.length} unique entries remain.`);
    
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
  }
}

// Optional: Function to get waitlist statistics
function getWaitlistStats() {
  try {
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace this!
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    const lastRow = sheet.getLastRow();
    const totalSignups = lastRow > 1 ? lastRow - 1 : 0; // Subtract header row
    
    // Get recent signups (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    let recentSignups = 0;
    if (totalSignups > 0) {
      const timestamps = sheet.getRange(2, 5, totalSignups, 1).getValues(); // Column E = Date Added
      recentSignups = timestamps.filter(([date]) => new Date(date) >= weekAgo).length;
    }
    
    return {
      total: totalSignups,
      recent: recentSignups,
      lastUpdated: new Date()
    };
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return { total: 0, recent: 0, error: error.message };
  }
}

/* 
SETUP INSTRUCTIONS:

1. Go to https://script.google.com
2. Create a new project
3. Replace the default code with this code
4. Update the SPREADSHEET_ID variable with your Google Sheets ID
5. Save the project
6. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Access: "Anyone"
   - Click "Deploy"
7. Copy the web app URL and update your React app

OPTIONAL CLEANUP:
- Run cleanExistingDuplicates() once to clean current data
- Use getWaitlistStats() to monitor growth

*/ 