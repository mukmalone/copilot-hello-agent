const mongoose = require('mongoose');
const Note = require('../models/Note');

const VALIDATION_ERROR = 'Validation failed';
const INVALID_NOTE_ID_ERROR = 'Invalid note id';
const NOTE_NOT_FOUND_ERROR = 'Note not found';
const DATABASE_UNAVAILABLE_ERROR = 'Database unavailable. Start MongoDB and try again.';

const isValidNoteId = (value) => mongoose.Types.ObjectId.isValid(value);
const isDatabaseReady = () => mongoose.connection.readyState === 1;

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

const normalizeNoteInput = ({ title, content }) => ({
  title: title.trim(),
  content: content.trim(),
});

const sendValidationError = (res, messages) =>
  res.status(400).json({
    error: VALIDATION_ERROR,
    messages,
  });

const sendInvalidIdError = (res) =>
  res.status(400).json({ error: INVALID_NOTE_ID_ERROR });

const sendDatabaseUnavailable = (res) =>
  res.status(503).json({ error: DATABASE_UNAVAILABLE_ERROR });

const sendNoteNotFound = (res) =>
  res.status(404).json({ error: NOTE_NOT_FOUND_ERROR });

const createNote = async (req, res) => {
  const { title, content } = req.body || {};
  const errors = validateNoteInput({ title, content });

  if (!isDatabaseReady()) {
    return sendDatabaseUnavailable(res);
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  const note = await Note.create(normalizeNoteInput({ title, content }));
  return res.status(201).json(note);
};

const getNotes = async (req, res) => {
  if (!isDatabaseReady()) {
    return sendDatabaseUnavailable(res);
  }

  const notes = await Note.find().sort({ createdAt: 1 });
  return res.status(200).json(notes);
};

const getNoteById = async (req, res) => {
  const { id } = req.params;

  if (!isDatabaseReady()) {
    return sendDatabaseUnavailable(res);
  }

  if (!isValidNoteId(id)) {
    return sendInvalidIdError(res);
  }

  const note = await Note.findById(id);

  if (!note) {
    return sendNoteNotFound(res);
  }

  return res.status(200).json(note);
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body || {};
  const errors = validateNoteInput({ title, content });

  if (!isDatabaseReady()) {
    return sendDatabaseUnavailable(res);
  }

  if (!isValidNoteId(id)) {
    return sendInvalidIdError(res);
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  const updatedNote = await Note.findByIdAndUpdate(id, normalizeNoteInput({ title, content }), {
    new: true,
    runValidators: true,
  });

  if (!updatedNote) {
    return sendNoteNotFound(res);
  }

  return res.status(200).json(updatedNote);
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!isDatabaseReady()) {
    return sendDatabaseUnavailable(res);
  }

  if (!isValidNoteId(id)) {
    return sendInvalidIdError(res);
  }

  const deletedNote = await Note.findByIdAndDelete(id);

  if (!deletedNote) {
    return sendNoteNotFound(res);
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
