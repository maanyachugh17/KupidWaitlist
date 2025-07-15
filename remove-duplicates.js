// Duplicate Removal Utility for Kupid Waitlist
// Usage: node remove-duplicates.js input.csv output.csv

const fs = require('fs');
const path = require('path');

function removeDuplicates(inputFile, outputFile = null) {
  try {
    // Read the CSV file
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      console.log('❌ No data found in file');
      return;
    }

    const header = lines[0];
    const dataLines = lines.slice(1);
    
    console.log(`📊 Processing ${dataLines.length} entries...`);
    
    // Track unique entries by phone number (most reliable identifier)
    const seen = new Set();
    const unique = [];
    const duplicates = [];
    
    for (const line of dataLines) {
      const columns = line.split(',');
      if (columns.length < 2) continue;
      
      // Extract phone number (assuming it's in column 2, adjust if needed)
      const phoneIndex = columns.length > 2 ? 1 : 1; // Adjust based on your CSV structure
      let phone = columns[phoneIndex]?.trim().replace(/"/g, '');
      
      // Normalize phone number for comparison
      const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
      
      if (seen.has(normalizedPhone)) {
        duplicates.push(line);
        console.log(`🔄 Duplicate found: ${phone}`);
      } else {
        seen.add(normalizedPhone);
        unique.push(line);
      }
    }
    
    // Create output content
    const outputContent = [header, ...unique].join('\n');
    
    // Write to output file
    const output = outputFile || inputFile.replace('.csv', '_cleaned.csv');
    fs.writeFileSync(output, outputContent);
    
    console.log('\n✅ Duplicate removal complete!');
    console.log(`📈 Original entries: ${dataLines.length}`);
    console.log(`✨ Unique entries: ${unique.length}`);
    console.log(`🗑️  Duplicates removed: ${duplicates.length}`);
    console.log(`💾 Clean file saved as: ${output}`);
    
    if (duplicates.length > 0) {
      const duplicatesFile = output.replace('.csv', '_duplicates.csv');
      fs.writeFileSync(duplicatesFile, [header, ...duplicates].join('\n'));
      console.log(`🔍 Duplicates saved to: ${duplicatesFile}`);
    }
    
  } catch (error) {
    console.error('❌ Error processing file:', error.message);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Kupid Waitlist - Duplicate Remover

Usage:
  node remove-duplicates.js input.csv [output.csv]

Example:
  node remove-duplicates.js waitlist_export.csv waitlist_clean.csv

If no output file is specified, creates input_cleaned.csv
    `);
    process.exit(1);
  }
  
  const [inputFile, outputFile] = args;
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }
  
  removeDuplicates(inputFile, outputFile);
}

module.exports = { removeDuplicates }; 