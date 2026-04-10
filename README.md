# copilot-hello-agent

## Running with MongoDB

This app now stores notes in **MongoDB** instead of keeping them only in memory.

### 1. Start MongoDB

If you already have MongoDB running locally, you can skip this step. Otherwise, you can start it with Docker:

```bash
docker run -d \
  --name copilot-hello-agent-mongo \
  -p 27017:27017 \
  mongo:7
```

### 2. Set the connection string (optional)

By default, the app uses:

```bash
mongodb://127.0.0.1:27017/copilot_hello_agent
```

To override it:

```bash
export MONGODB_URI="mongodb://127.0.0.1:27017/copilot_hello_agent"
```

### 3. Start the server

```bash
npm start
```

The app runs at `http://localhost:3000`.

## Running the React frontend

The frontend lives in `client/` and uses **Vite + React**.

### 1. Install the frontend dependencies

```bash
cd client
npm install
```

### 2. Start the frontend dev server

```bash
npm run dev
```

Then open the URL shown by Vite, usually:

```text
http://localhost:5173
```

Keep the Express backend running on `http://localhost:3000` in another terminal.
The Vite dev server proxies `/api` requests to the backend, so the frontend can call the existing notes API cleanly.

## Testing the Notes API with `curl`

### 1. Get all notes

```bash
curl -s http://localhost:3000/api/notes
```

This returns notes with string `id` values from MongoDB.

### 2. Get one note by id

First copy an `id` from the list response above, then run:

```bash
curl -s http://localhost:3000/api/notes/<noteId>
```

### 3. Create a new note

```bash
curl -s -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First note","content":"Hello world"}'
```

### 4. Update a note

```bash
curl -s -X PUT http://localhost:3000/api/notes/<noteId> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated note","content":"Updated content"}'
```

### 5. Delete a note

```bash
curl -s -X DELETE http://localhost:3000/api/notes/<noteId>
```

> Notes are now persisted in MongoDB, so they remain available after the server restarts.
