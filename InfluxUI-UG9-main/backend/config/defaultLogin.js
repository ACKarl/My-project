// backend/config/defaultLogin.js
const { InfluxDB } = require('@influxdata/influxdb-client');

// Manage all default login configurations centrally
const config = {
    url: 'http://localhost:8086',
    token: process.env.INFLUXDB_TOKEN || '8a9c0JJv0w4lNxq-g6IojWw84DJoAkgH99HXy_x7bfpWR_ZL_oo6IhaCoeVbY9Y4-CsEffS234vByCIuHSFAWQ==',
    org: 'InfluxUI_UG9'
};

// Create and export the InfluxDB instance
const influxDB = new InfluxDB({ url: config.url, token: config.token });

module.exports = { influxDB, config };