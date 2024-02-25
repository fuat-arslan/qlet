const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

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
    const quizData = await readCSV('quiz_data.csv');
    res.json(quizData);
  } catch (error) {
    res.status(500).send('Error reading quiz data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
