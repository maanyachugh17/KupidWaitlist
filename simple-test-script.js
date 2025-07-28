// Simple test script to verify deployment
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ 
      result: "success", 
      message: "Test API is working!" 
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ 
      result: "success", 
      message: "POST request received!" 
    })
  ).setMimeType(ContentService.MimeType.JSON);
} 