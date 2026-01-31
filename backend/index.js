const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DECKS_FILE = path.join(DATA_DIR, 'decks.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DECKS_FILE);
  } catch (e) {
    await fs.writeFile(DECKS_FILE, '[]', 'utf8');
  }
}

async function readDecks() {
  await ensureDataFile();
  const raw = await fs.readFile(DECKS_FILE, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function writeDecks(decks) {
  await ensureDataFile();
  await fs.writeFile(DECKS_FILE, JSON.stringify(decks, null, 2), 'utf8');
}

app.get('/api/decks', async (req, res) => {
  const decks = await readDecks();
  res.json(decks);
});

app.post('/api/decks', async (req, res) => {
  const decks = req.body;
  if (!Array.isArray(decks)) return res.status(400).json({ error: 'Expected an array of decks' });
  await writeDecks(decks);
  res.json({ ok: true });
});

app.put('/api/decks/:id', async (req, res) => {
  const id = req.params.id;
  const decks = await readDecks();
  const existingIndex = decks.findIndex(d => d.id === id);
  if (existingIndex >= 0) {
    decks[existingIndex] = req.body;
  } else {
    decks.push(req.body);
  }
  await writeDecks(decks);
  res.json({ ok: true });
});

app.delete('/api/decks/:id', async (req, res) => {
  const id = req.params.id;
  let decks = await readDecks();
  decks = decks.filter(d => d.id !== id);
  await writeDecks(decks);
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`FlashPulse backend listening on http://localhost:${port}`);
});
