CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL CHECK(length(text) BETWEEN 3 AND 240),
  name TEXT NOT NULL DEFAULT '' CHECK(length(name) <= 32),
  color TEXT NOT NULL CHECK(color IN ('butter','pink','mint','blue')),
  created_at INTEGER NOT NULL,
  ip_hash TEXT NOT NULL
);
CREATE INDEX notes_created ON notes(created_at DESC, id);
CREATE INDEX notes_rate ON notes(ip_hash, created_at DESC);
