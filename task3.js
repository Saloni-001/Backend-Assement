const express = require('express');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Public API Data Retrieval API',
            version: '1.0.0',
            description: 'API endpoints to fetch data from a public API with filtering options',
        },
    },
    apis: [__filename], // Path to this file
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API base URL
const API_BASE_URL = 'https://api.publicapis.org';

/**
 * @swagger
 * /api/data:
 *   get:
 *     summary: Fetch data from the public API with filtering options
 *     description: Fetch data from the public API with filtering options based on category and result limit.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter data by category (case-insensitive)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Limit the number of results returned
 *     responses:
 *       '200':
 *         description: Successful response with the fetched data
 */
app.get('/api/data', async (req, res) => {
    try {
        // Fetching data from public API
        const response = await axios.get(`${API_BASE_URL}/entries`);
        const data = response.data.entries;

        // Applying filtering options
        let filteredData = data;

        // Filter by category if provided in query params
        if (req.query.category) {
            const category = req.query.category.toLowerCase();
            filteredData = filteredData.filter(entry => entry.Category.toLowerCase().includes(category));
        }

        // Limiting results if provided in query params
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            if (!isNaN(limit) && limit > 0) {
                filteredData = filteredData.slice(0, limit);
            }
        }

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
