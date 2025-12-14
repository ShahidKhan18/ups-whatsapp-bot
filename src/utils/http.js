const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const { ENV } = require("../config/env");

function createHttpClient(baseURL, cookieJar) {
    const jar = cookieJar || new CookieJar();

    const client = wrapper(
        axios.create({
            baseURL,
            timeout: ENV.HTTP_TIMEOUT,
            withCredentials: true,
            validateStatus: () => true, // UPS does not use HTTP codes properly
        })
    );

    client.defaults.jar = jar;

    return { client, jar };
}

async function pingUPS(ip, protocol = "http") {
    try {
        const response = await axios.get(`${protocol}://${ip}`, {
            timeout: 3000, // 3 second timeout for ping
            validateStatus: () => true, // Accept any status code
        });
        return { success: true };
    } catch (error) {
        // Network error, timeout, or connection refused
        return {
            success: false,
            error: error.code === 'ECONNREFUSED'
                ? 'Connection refused'
                : error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED'
                    ? 'Connection timeout'
                    : 'Network error'
        };
    }
}

module.exports = { createHttpClient, pingUPS };
