-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create live_shows table
CREATE TABLE IF NOT EXISTS live_shows (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('PLANNED', 'LIVE', 'ENDED')),
  host_id INTEGER REFERENCES users(id),
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_live_shows_status ON live_shows(status);
CREATE INDEX IF NOT EXISTS idx_live_shows_scheduled_at ON live_shows(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_live_shows_slug ON live_shows(slug);
