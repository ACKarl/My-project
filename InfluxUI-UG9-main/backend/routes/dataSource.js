// backend/routes/dataSource.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { config } = require('../config/defaultLogin');
const { InfluxDB } = require('@influxdata/influxdb-client');

// Get the bucket list
router.get('/buckets', async (req, res) => {
    // fetch the InfluxDB login data from the request header.
    const token = req.headers['authorization']?.split(' ')[1]; 
    const org = req.headers['x-org-name'];

    if (!token || !org) {
        return res.status(401).json({ message: 'Unauthorized. Please login first.' });
    }

    try {
        const response = await axios.get(`${config.url}/api/v2/buckets`, {
            headers: {
                'Authorization': `Token ${token}`
            },
            params: {
                org: org
            }
        });

        if (response.status === 200) {
            const bucketNames = response.data.buckets.map(bucket => bucket.name);
            res.status(200).json(bucketNames);
        } else {
            res.status(response.status).json({ message: response.statusText });
        }
    } catch (error) {
        console.error('Error fetching buckets:', error.message);
        res.status(500).json({ message: 'Failed to fetch buckets' });
    }
});

// get the measurements list
router.get('/measurements', async (req, res) => {
    const bucket = req.query.bucket;
    const token = req.headers['authorization']?.split(' ')[1];
    const org = req.headers['x-org-name'];

    if (!bucket) {
        return res.status(400).json({ message: 'Bucket name is required' });
    }

    if (!token || !org) {
        return res.status(401).json({ message: 'Unauthorized. Please login first.' });
    }

    try {
        // Query all measurements inside chosen bucket.
        const client = new InfluxDB({ url: config.url, token: token });
        const queryApi = client.getQueryApi(org);

        const fluxQuery = `
            from(bucket: "${bucket}")
            |> range(start: 0)
            |> keep(columns: ["_measurement"])
            |> unique(column: "_measurement")
        `;

        let measurements = [];
        queryApi.queryRows(fluxQuery, {
            next: (row, tableMeta) => {
                const o = tableMeta.toObject(row);
                measurements.push(o._measurement);
            },
            error: (error) => {
                console.error('Error querying measurements:', error.message);
                res.status(500).json({ message: 'Failed to fetch measurements' });
            },
            complete: () => {
                res.status(200).json(measurements);
            }
        });
    } catch (error) {
        console.error('Error fetching measurements:', error.message);
        res.status(500).json({ message: 'Failed to fetch measurements' });
    }
});

// get the fields list
router.get('/fields', async (req, res) => {
    const bucket = req.query.bucket;
    const measurement = req.query.measurement;
    const token = req.headers['authorization']?.split(' ')[1];
    const org = req.headers['x-org-name'];

    if (!bucket || !measurement) {
        return res.status(400).json({ message: 'Bucket and measurement names are required' });
    }

    if (!token || !org) {
        return res.status(401).json({ message: 'Unauthorized. Please login first.' });
    }

    try {
        // Query fields inside chosen measurement.
        const client = new InfluxDB({ url: config.url, token: token });
        const queryApi = client.getQueryApi(org);

        const fluxQuery = `
            from(bucket: "${bucket}")
            |> range(start: 0)
            |> filter(fn: (r) => r._measurement == "${measurement}")
            |> keep(columns: ["_field"])
            |> unique(column: "_field")
        `;

        let fields = [];
        queryApi.queryRows(fluxQuery, {
            next: (row, tableMeta) => {
                const o = tableMeta.toObject(row);
                fields.push(o._field);
            },
            error: (error) => {
                console.error('Error querying fields:', error.message);
                res.status(500).json({ message: 'Failed to fetch fields' });
            },
            complete: () => {
                res.status(200).json(fields);
            }
        });
    } catch (error) {
        console.error('Error fetching fields:', error.message);
        res.status(500).json({ message: 'Failed to fetch fields' });
    }
});

module.exports = router;
