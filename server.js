const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // For writing to CSV
const app = express();
const port = 3000;

// Middlewares
app.use(express.static('public')); // Serve static files
app.use(bodyParser.json()); // Parse JSON bodies

// Function to read CSV data
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}

// API endpoint to get quiz data
app.get('/api/quiz', async (req, res) => {
  try {
    const quizData = await readCSV('data/quiz_data.csv');
    res.json(quizData);
  } catch (error) {
    res.status(500).send('Error reading quiz data');
  }
});

// Endpoint to submit answers
app.post('/submit-answer', async (req, res) => {
  const { userId, questionId, selectedOption } = req.body;
  
  const csvWriter = createCsvWriter({
    path: 'data/answers.csv',
    append: true,
    header: [
      {id: 'userId', title: 'UserID'},
      {id: 'questionId', title: 'QuestionID'},
      {id: 'selectedOption', title: 'SelectedOption'}
    ]
  });

  try {
    await csvWriter.writeRecords([{ userId, questionId, selectedOption }]); // Writing the answer with userId to CSV
    res.json({message: 'Answer saved successfully'});
  } catch (error) {
    console.error('Failed to save answer:', error);
    res.status(500).json({error: 'Failed to save answer'});
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
