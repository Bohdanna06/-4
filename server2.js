const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'usersDB'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Connected to MySQL');
});

// Реєстрація
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], async (err, result) => {
        if (err) return res.status(500).send({ error: 'DB error' });
        if (result.length > 0) {
            return res.status(400).send({ error: 'User or email already exists' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, hashedPassword, email], (err, result) => {
                if (err) return res.status(500).send({ error: 'Insert error' });
                res.send({ message: 'Registration successful' });
            });
        } catch {
            res.status(500).send({ error: 'Hashing error' });
        }
    });
});

// Авторизація
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, result) => {
        if (err) return res.status(500).send({ error: 'DB error' });
        if (result.length === 0) return res.status(401).send({ error: 'Invalid credentials' });

        try {
            const user = result[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) return res.status(401).send({ error: 'Invalid credentials' });

            res.send({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
        } catch {
            res.status(500).send({ error: 'Login error' });
        }
    });
});

app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
