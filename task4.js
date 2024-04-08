const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Secret key for JWT
const JWT_SECRET = 'your_secret_key';

// Dummy database to store users
const users = [];

// API base URL
const API_BASE_URL = 'https://api.publicapis.org';

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

/**
 * This endpoint is secured and can only be accessed by authenticated users.
 * @swagger
 * /api/secure:
 *   get:
 *     summary: Secure endpoint accessible only to authenticated users
 *     description: This endpoint returns a message if the user is authenticated.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with a message for authenticated users.
 *       '401':
 *         description: Unauthorized access. User is not authenticated.
 */
app.get('/api/secure', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}! You have accessed the secure endpoint.` });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
