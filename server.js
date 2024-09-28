const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Get notes from the JSON file
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read notes.' });
        }
        res.json(JSON.parse(data));
    });
});

// Post a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (!title || !text) {
        return res.status(400).json({ message: 'Note title and text are required.' });
    }

    const newNote = { id: uuidv4(), title, text };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read notes.' });
        }

        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to save note.' });
            }
            res.json(newNote);
        });
    });
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read notes.' });
        }

        const notes = JSON.parse(data);
        const updatedNotes = notes.filter((note) => note.id !== noteId);

        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete note.' });
            }
            res.json({ message: 'Note deleted' });
        });
    });
});

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
