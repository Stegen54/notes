let isEditMode = false;
let currentEditId = null;

// Function to handle adding or updating a note
function handleAddUpdate() {
    if (isEditMode) {
        updateNote();
    } else {
        addNote();
    }
}

// Function to add a new note
function addNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value;

    if (noteText.trim() === '') {
        alert('Please write something in the note');
        return;
    }

    const note = {
        id: new Date().getTime(),
        text: noteText
    };

    // Create a new note element
    createNoteElement(note);

    // Save the note to local storage
    saveNoteToLocalStorage(note);

    // Clear the input field
    noteInput.value = '';
}

// Function to update an existing note
function updateNote() {
    const noteInput = document.getElementById('note-input');
    const newNoteText = noteInput.value;

    if (newNoteText.trim() === '') {
        alert('Please write something in the note');
        return;
    }

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteIndex = notes.findIndex(note => note.id === currentEditId);

    if (noteIndex !== -1) {
        notes[noteIndex].text = newNoteText;
        localStorage.setItem('notes', JSON.stringify(notes));

        const noteElement = document.querySelector(`.note[data-id='${currentEditId}']`);
        noteElement.firstChild.nodeValue = newNoteText;
    }

    // Reset the edit mode
    resetEditMode();
}

// Function to create a note element
function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.setAttribute('data-id', note.id);
    noteElement.innerText = note.text;

    // Create a container for buttons
    const noteButtons = document.createElement('div');
    noteButtons.classList.add('note-buttons');

    // Create edit and delete buttons
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.onclick = () => enterEditMode(note.id);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = () => deleteNote(note.id);

    // Append buttons to the container
    noteButtons.appendChild(editButton);
    noteButtons.appendChild(deleteButton);

    // Append buttons container to the note element
    noteElement.appendChild(noteButtons);

    // Add the new note element to the notes container
    const notesContainer = document.getElementById('notes-container');
    notesContainer.appendChild(noteElement);
}

// Function to save a note to local storage
function saveNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to load notes from local storage
function loadNotesFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesContainer = document.getElementById('notes-container');

    notes.forEach(note => {
        createNoteElement(note);
    });
}

// Function to delete a note
function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(notes));

    const noteElement = document.querySelector(`.note[data-id='${noteId}']`);
    noteElement.remove();

    // If the note being deleted is currently being edited, reset the edit mode
    if (isEditMode && currentEditId === noteId) {
        resetEditMode();
    }
}

// Function to enter edit mode
function enterEditMode(noteId) {
    const noteElement = document.querySelector(`.note[data-id='${noteId}']`);
    const noteText = noteElement.innerText;

    const noteInput = document.getElementById('note-input');
    noteInput.value = noteText;

    currentEditId = noteId;
    isEditMode = true;

    const addUpdateBtn = document.getElementById('add-update-btn');
    addUpdateBtn.innerText = 'Update Note';
}

// Function to reset edit mode
function resetEditMode() {
    isEditMode = false;
    currentEditId = null;

    const noteInput = document.getElementById('note-input');
    noteInput.value = '';

    const addUpdateBtn = document.getElementById('add-update-btn');
    addUpdateBtn.innerText = 'Add Note';
}

// Load notes when the page is loaded
window.onload = loadNotesFromLocalStorage;
