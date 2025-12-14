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

module.exports = { createHttpClient };
