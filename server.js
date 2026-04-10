const mongoose = require('mongoose');
const app = require('./app');
const Note = require('./models/Note');

const DEFAULT_PORT = 3000;
const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/copilot_hello_agent';
const DB_RETRY_DELAY_MS = 5000;

const PORT = process.env.PORT || DEFAULT_PORT;
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

const sampleNotes = [
  {
    title: 'Welcome note',
    content: 'This is your first sample note.',
  },
  {
    title: 'Shopping list',
    content: 'Milk, bread, and coffee.',
  },
  {
    title: 'Reminder',
    content: 'Review the Notes API routes with curl.',
  },
];

let retryTimer = null;

const seedNotesIfEmpty = async () => {
  const noteCount = await Note.countDocuments();

  if (noteCount === 0) {
    await Note.insertMany(sampleNotes);
  }
};

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Connected to MongoDB');
    await seedNotesIfEmpty();

    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  } catch (error) {
    console.warn(`MongoDB is unavailable: ${error.message}`);
    console.warn(
      `The server will keep running and retry the database connection in ${DB_RETRY_DELAY_MS / 1000} seconds.`
    );

    if (!retryTimer) {
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connectToDatabase();
      }, DB_RETRY_DELAY_MS);
    }
  }
};

const startListening = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const startServer = async () => {
  startListening();
  await connectToDatabase();
};

startServer();
