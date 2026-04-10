import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  content: '',
};

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const readResponseData = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const getErrorMessage = (data, fallbackMessage) => {
  if (data && typeof data === 'object') {
    return data.messages?.join(', ') || data.error || fallbackMessage;
  }

  if (typeof data === 'string' && data.trim() !== '') {
    return data;
  }

  return fallbackMessage;
};

const createChangeHandler = (setFormState) => (event) => {
  const { name, value } = event.target;

  setFormState((currentForm) => ({
    ...currentForm,
    [name]: value,
  }));
};

const fetchJson = async (url, options, fallbackMessage) => {
  const response = await fetch(url, options);
  const data = await readResponseData(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallbackMessage));
  }

  return data;
};

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchJson('/api/notes', undefined, 'Failed to load notes');
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateChange = createChangeHandler(setForm);
  const handleEditChange = createChangeHandler(setEditForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await fetchJson(
        '/api/notes',
        {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(form),
        },
        'Failed to create note'
      );

      setForm(emptyForm);
      await loadNotes();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditForm({
      title: note.title,
      content: note.content,
    });
    setError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleUpdate = async (noteId) => {
    setSavingEdit(true);
    setError('');

    try {
      await fetchJson(
        `/api/notes/${noteId}`,
        {
          method: 'PUT',
          headers: jsonHeaders,
          body: JSON.stringify(editForm),
        },
        'Failed to update note'
      );

      cancelEditing();
      await loadNotes();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (noteId) => {
    setDeletingId(noteId);
    setError('');

    try {
      await fetchJson(
        `/api/notes/${noteId}`,
        {
          method: 'DELETE',
        },
        'Failed to delete note'
      );

      if (editingId === noteId) {
        cancelEditing();
      }

      await loadNotes();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main>
      <h1>Notes</h1>
      <p>This tiny React page reads from the existing Express backend.</p>

      <section>
        <h2>Create a note</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <br />
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleCreateChange}
              placeholder="Note title"
            />
          </div>

          <div>
            <label htmlFor="content">Content</label>
            <br />
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleCreateChange}
              placeholder="Write a short note"
              rows="4"
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add note'}
          </button>
        </form>
      </section>

      {error ? <p>{error}</p> : null}

      <section>
        <h2>Saved notes</h2>

        {loading ? <p>Loading notes...</p> : null}

        {!loading && notes.length === 0 ? <p>No notes yet.</p> : null}

        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              {editingId === note.id ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleUpdate(note.id);
                  }}
                >
                  <div>
                    <label htmlFor={`edit-title-${note.id}`}>Title</label>
                    <br />
                    <input
                      id={`edit-title-${note.id}`}
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div>
                    <label htmlFor={`edit-content-${note.id}`}>Content</label>
                    <br />
                    <textarea
                      id={`edit-content-${note.id}`}
                      name="content"
                      value={editForm.content}
                      onChange={handleEditChange}
                      rows="4"
                    />
                  </div>

                  <button type="submit" disabled={savingEdit}>
                    {savingEdit ? 'Saving...' : 'Save changes'}
                  </button>
                  <button type="button" onClick={cancelEditing} disabled={savingEdit}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <strong>{note.title}</strong>
                  <p>{note.content}</p>
                  <button type="button" onClick={() => startEditing(note)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                  >
                    {deletingId === note.id ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
