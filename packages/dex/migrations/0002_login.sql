ALTER TABLE users ADD COLUMN login_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS users_login_hash ON users(login_hash);
