# copilot-hello-agent

## Testing the Notes API with `curl`

Start the server first:

```bash
npm start
```

The app runs at `http://localhost:3000`.

### 1. Get all notes

```bash
curl -s http://localhost:3000/api/notes
```

### 2. Get one note by id

```bash
curl -s http://localhost:3000/api/notes/1
```

### 3. Create a new note

```bash
curl -s -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First note","content":"Hello world"}'
```

### 4. Update a note

```bash
curl -s -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated note","content":"Updated content"}'
```

### 5. Delete a note

```bash
curl -s -X DELETE http://localhost:3000/api/notes/1
```

> Notes are stored in memory, so they are cleared whenever the server restarts.
