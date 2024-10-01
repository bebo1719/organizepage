const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  // Import UUID for unique note IDs

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Serve the `notes.html` for the /notes route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Fallback route for the root (`/`) serving `index.html`
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      return res.status(500).json({ error: 'Failed to retrieve notes' });
    }
    res.json(JSON.parse(data));  // Respond with the notes
  });
});

// POST request to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };  // Add a unique ID using UUID

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      return res.status(500).json({ error: 'Failed to save note' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);  // Add new note to the array

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error('Error writing to notes file:', err);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);  // Respond with the saved note
    });
  });
});

// DELETE request to delete a note by id
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;  // Extract the id from the URL parameters

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      return res.status(500).json({ error: 'Failed to delete note' });
    }

    let notes;
    try {
      notes = JSON.parse(data);  // Parse the JSON data into an array
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return res.status(500).json({ error: 'Failed to parse notes data' });
    }

    // Filter out the note with the matching ID
    const filteredNotes = notes.filter(note => note.id !== id);

    // Write the updated notes array back to the JSON file
    fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 2), (err) => {
      if (err) {
        console.error('Error writing to notes file:', err);
        return res.status(500).json({ error: 'Failed to delete note' });
      }

      res.json({ message: 'Note deleted' });  // Respond with a success message
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




