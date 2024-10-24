// backend/controllers/authController.js
const { InfluxDB } = require('@influxdata/influxdb-client');
//const jwt = require('jsonwebtoken');
const axios = require('axios');
const { config } = require('../config/defaultLogin'); // Import the default login configuration

const login = async (req, res) => {
    const { token = config.token, url = config.url, org = config.org } = req.body;

    try {
        // Check the health of the InfluxDB instance
        const response = await axios.get(`${url}/health`);

        if (response.status === 200 && response.data.status === 'pass') {
            // If health check passes, return successful login response
            res.status(200).json({ message: 'Login successful', url, org, token });
        } else {
            res.status(500).json({ message: 'InfluxDB instance is not healthy.' });
        }
    } catch (error) {
        console.error('Error during health check:', error.message);
        res.status(401).json({ message: 'Invalid token or server error', error: error.message });
    }
};

// Custom login function to handle user-provided token and URL
const customLogin = async (req, res) => {
    const { token, url, org } = req.body;

    if (!token || !url || !org) {
        return res.status(400).json({ message: 'Missing required fields: url, org, or token' });
    }

    try {
        // Check the health of the InfluxDB instance
        const response = await axios.get(`${url}/health`);

        if (response.status === 200 && response.data.status === 'pass') {
            // Create InfluxDB client with provided token and url
            const client = new InfluxDB({ url, token });

            // Generate JWT and respond if successful
            const jwtToken = jwt.sign({ username: 'custom-user', token }, 'your-secret-key', { expiresIn: '1h' });
            res.status(200).json({ token: jwtToken });
        } else {
            res.status(500).json({ message: 'InfluxDB instance is not healthy.' });
        }
    } catch (error) {
        console.error('Error during health check or token validation:', error.message);
        res.status(401).json({ message: 'Invalid token or server error', error: error.message });
    }
};

module.exports = { login, customLogin };
