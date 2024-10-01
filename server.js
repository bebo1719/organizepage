const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET route for fetching notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    res.json(JSON.parse(data));
  });
});

// POST route for saving a note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    const notes = JSON.parse(data);
    newNote.id = notes.length + 1; // You can generate unique IDs better with UUID
    notes.push(newNote);

    fs.writeFile(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save note' });
        }
        res.json(newNote);
      }
    );
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});



