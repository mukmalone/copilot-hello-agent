const notes = [
  {
    id: 1,
    title: 'Welcome note',
    content: 'This is your first sample note.',
  },
  {
    id: 2,
    title: 'Shopping list',
    content: 'Milk, bread, and coffee.',
  },
  {
    id: 3,
    title: 'Reminder',
    content: 'Review the Notes API routes with curl.',
  },
];
let nextId = 4;

const getAllNotes = () => notes;

const getNoteById = (id) => notes.find((note) => note.id === id);

const createNote = ({ title, content }) => {
  const newNote = {
    id: nextId++,
    title,
    content,
  };

  notes.push(newNote);
  return newNote;
};

const updateNote = (id, { title, content }) => {
  const note = getNoteById(id);

  if (!note) {
    return null;
  }

  note.title = title;
  note.content = content;
  return note;
};

const deleteNote = (id) => {
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    return null;
  }

  const deletedNotes = notes.splice(noteIndex, 1);
  return deletedNotes[0];
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
