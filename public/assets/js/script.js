let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;
let activeNote = {};

// When on the /notes page
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group');

  // Fetch notes from the server
  const getNotes = () => fetch('/api/notes').then((res) => res.json());

  // Save note to server
  const saveNote = (note) => {
    return fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
  };

  // Delete note from server
  const deleteNote = (id) => {
    return fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const renderNotes = async () => {
    const notes = await getNotes();
    noteList.innerHTML = '';
    notes.forEach((note) => {
      const li = document.createElement('li');
      li.textContent = note.title;
      li.classList.add('list-group-item');
      li.dataset.id = note.id;
      li.addEventListener('click', () => {
        noteTitle.value = note.title;
        noteText.value = note.text;
        activeNote = note;
      });
      noteList.append(li);
    });
  };

  saveNoteBtn.addEventListener('click', () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };
    saveNote(newNote).then(renderNotes);
    noteTitle.value = '';
    noteText.value = '';
  });

  newNoteBtn.addEventListener('click', () => {
    noteTitle.value = '';
    noteText.value = '';
    activeNote = {};
  });

  clearBtn.addEventListener('click', () => {
    noteTitle.value = '';
    noteText.value = '';
    activeNote = {};
  });

  renderNotes();
}

