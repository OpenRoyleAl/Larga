ALTER TABLE users ADD COLUMN github_id TEXT;
ALTER TABLE users ADD COLUMN google_sub TEXT;
ALTER TABLE users ADD COLUMN email TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS users_github_id ON users(github_id);
CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub ON users(google_sub);
