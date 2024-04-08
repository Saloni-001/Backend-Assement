const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// Dummy database to store users
const users = [];

// Secret key for JWT
const JWT_SECRET = 'your_secret_key';

//Task 1: Implement User Authentication with JWT

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// User registration endpoint
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { id: Date.now(), username: req.body.username, password: hashedPassword };
        users.push(user);
        res.status(201).send('User registered successfully');
    } catch {
        res.status(500).send('Failed to register user');
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            res.status(401).send('Invalid password');
        }
    } catch {
        res.status(500).send('Login failed');
    }
});

// Logout endpoint (optional)
app.post('/logout', (req, res) => {
    res.send('Logged out successfully');
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.send('You have accessed protected route');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
