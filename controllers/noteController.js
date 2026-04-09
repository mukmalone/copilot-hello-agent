const Note = require('../models/Note');

const parseNoteId = (value) => Number.parseInt(value, 10);

const validateNoteInput = ({ title, content } = {}) => {
  const errors = [];

  if (typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required');
  }

  if (typeof content !== 'string' || content.trim() === '') {
    errors.push('Content is required');
  }

  return errors;
};

const createNote = (req, res) => {
  const { title, content } = req.body || {};
  const errors = validateNoteInput({ title, content });

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
  }

  const note = Note.createNote({
    title: title.trim(),
    content: content.trim(),
  });

  return res.status(201).json(note);
};

const getNotes = (req, res) => {
  const notes = Note.getAllNotes();
  return res.status(200).json(notes);
};

const getNoteById = (req, res) => {
  const id = parseNoteId(req.params.id);
  const note = Note.getNoteById(id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  return res.status(200).json(note);
};

const updateNote = (req, res) => {
  const id = parseNoteId(req.params.id);
  const { title, content } = req.body || {};
  const errors = validateNoteInput({ title, content });

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
  }

  const updatedNote = Note.updateNote(id, {
    title: title.trim(),
    content: content.trim(),
  });

  if (!updatedNote) {
    return res.status(404).json({ error: 'Note not found' });
  }

  return res.status(200).json(updatedNote);
};

const deleteNote = (req, res) => {
  const id = parseNoteId(req.params.id);
  const deletedNote = Note.deleteNote(id);

  if (!deletedNote) {
    return res.status(404).json({ error: 'Note not found' });
  }

  return res.status(200).json({ message: 'Note deleted', note: deletedNote });
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
