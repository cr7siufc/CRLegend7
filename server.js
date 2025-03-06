const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json());

// Connect to a database file called "cr7siu.db"
// Note: SQLite files are not persistent on Vercel due to ephemeral file system. Consider a serverless database (e.g., Upstash Redis) for production.
const db = new sqlite3.Database('./cr7siu.db', (err) => {
    if (err) console.error('Database error:', err.message);
    console.log('Connected to SQLite database.');
});

// Create a table to store player data with all fields from game.js
db.run(`
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        points INTEGER,
        level INTEGER,
        tokens INTEGER,
        attributes TEXT,
        tasksCompleted TEXT,
        referralUsers TEXT,
        lastAdClaim INTEGER,
        lastCheckInClaim INTEGER,
        lastSpinClaim INTEGER,
        lastTaskClaims TEXT,
        lastRewardsClaim INTEGER
    )
`, (err) => {
    if (err) console.error('Error creating table:', err.message);
});

// Save or update player data
app.post('/save', (req, res) => {
    const {
        username,
        points,
        level,
        tokens,
        attributes,
        tasksCompleted,
        referralUsers,
        lastAdClaim,
        lastCheckInClaim,
        lastSpinClaim,
        lastTaskClaims,
        lastRewardsClaim
    } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const query = `
        INSERT INTO players (
            username, points, level, tokens, attributes, tasksCompleted, referralUsers,
            lastAdClaim, lastCheckInClaim, lastSpinClaim, lastTaskClaims, lastRewardsClaim
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET
            points = excluded.points,
            level = excluded.level,
            tokens = excluded.tokens,
            attributes = excluded.attributes,
            tasksCompleted = excluded.tasksCompleted,
            referralUsers = excluded.referralUsers,
            lastAdClaim = excluded.lastAdClaim,
            lastCheckInClaim = excluded.lastCheckInClaim,
            lastSpinClaim = excluded.lastSpinClaim,
            lastTaskClaims = excluded.lastTaskClaims,
            lastRewardsClaim = excluded.lastRewardsClaim
    `;

    const params = [
        username,
        points,
        level,
        tokens,
        attributes,
        tasksCompleted,
        referralUsers,
        lastAdClaim,
        lastCheckInClaim,
        lastSpinClaim,
        lastTaskClaims,
        lastRewardsClaim
    ];

    db.run(query, params, (err) => {
        if (err) {
            console.error('Error saving player data:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Data saved successfully' });
    });
});

// Get all players' data (for leaderboard)
app.get('/scores', (req, res) => {
    db.all('SELECT username, points, level, tokens FROM players', [], (err, rows) => {
        if (err) {
            console.error('Error fetching scores:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get a specific player's data
app.get('/player/:username', (req, res) => {
    const { username } = req.params;
    db.get('SELECT * FROM players WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error fetching player:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.json({ error: 'Player not found' });
        }
        res.json(row);
    });
});

// Export for Vercel serverless function
module.exports = app;