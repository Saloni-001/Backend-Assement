const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// API base URL
const API_BASE_URL = 'https://api.publicapis.org';

// Endpoint to fetch data with filtering options
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
