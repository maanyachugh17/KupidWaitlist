import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data file path
const dataFile = path.join(__dirname, 'waitlist-data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({
    submissions: [],
    lastUpdated: new Date().toISOString()
  }));
}

// Helper function to read data
function readData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { submissions: [], lastUpdated: new Date().toISOString() };
  }
}

// Helper function to write data
function writeData(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// Helper function to normalize phone number
function normalizePhone(phone) {
  return phone.replace(/[\s\-\(\)]/g, '');
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    result: 'success', 
    message: 'Kupid Waitlist API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    result: 'success', 
    message: 'Kupid Waitlist API is running!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/submit', (req, res) => {
  try {
    const { name, phone, timestamp, submission_id } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        result: 'error',
        message: 'Name and phone are required'
      });
    }

    // Trim whitespace
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // Validate phone number
    const digits = trimmedPhone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      return res.status(400).json({
        result: 'error',
        message: 'Please enter a valid phone number'
      });
    }

    // Read existing data
    const data = readData();
    
    // Check for duplicates
    const normalizedPhone = normalizePhone(trimmedPhone);
    const isDuplicate = data.submissions.some(submission => 
      normalizePhone(submission.phone) === normalizedPhone
    );

    if (isDuplicate) {
      return res.status(400).json({
        result: 'error',
        message: 'This phone number is already registered!'
      });
    }

    // Add new submission
    const newSubmission = {
      id: submission_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: trimmedName,
      phone: trimmedPhone,
      timestamp: timestamp || new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };

    data.submissions.push(newSubmission);

    // Write data
    if (writeData(data)) {
      console.log('New waitlist signup:', trimmedName, '-', trimmedPhone);
      res.json({
        result: 'success',
        message: 'Successfully added to waitlist!',
        submission: newSubmission
      });
    } else {
      res.status(500).json({
        result: 'error',
        message: 'Failed to save data'
      });
    }

  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({
      result: 'error',
      message: 'Server error: ' + error.message
    });
  }
});

// Get all submissions (for admin purposes)
app.get('/api/submissions', (req, res) => {
  try {
    const data = readData();
    res.json({
      result: 'success',
      count: data.submissions.length,
      submissions: data.submissions,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).json({
      result: 'error',
      message: 'Failed to read submissions'
    });
  }
});

// Clear all data (for admin purposes)
app.delete('/api/clear', (req, res) => {
  try {
    const data = { submissions: [], lastUpdated: new Date().toISOString() };
    if (writeData(data)) {
      res.json({
        result: 'success',
        message: 'All data cleared successfully'
      });
    } else {
      res.status(500).json({
        result: 'error',
        message: 'Failed to clear data'
      });
    }
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({
      result: 'error',
      message: 'Failed to clear data'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Kupid Waitlist server running on port ${PORT}`);
  console.log(`📊 Data file: ${dataFile}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
}); 