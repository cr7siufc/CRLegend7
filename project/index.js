// Step 1: Import express
const express = require('express');

// Step 2: Create an express app
const app = express();

// Step 3: Set up the server to listen on port 7001
const PORT = 7001;

// Step 4: Middleware to parse JSON requests
app.use(express.json());

// Step 5: Route to log progress data when a POST request is made
app.post('/log-progress', (req, res) => {
  console.log("Request body:", req.body);
  res.status(200).send('Progress logged');
});

// Step 6: Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
