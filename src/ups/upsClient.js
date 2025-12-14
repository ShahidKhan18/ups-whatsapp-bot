const { createHttpClient } = require("../utils/http");
const { DEFAULTS } = require("../config/defaults");

const clients = new Map();

function getUPSClient(ip) {
    if (clients.has(ip)) {
        return clients.get(ip);
    }

    const baseURL = `${DEFAULTS.UPS.PROTOCOL}://${ip}`;
    const { client, jar } = createHttpClient(baseURL);

    const upsClient = { client, jar };
    clients.set(ip, upsClient);

    return upsClient;
}

module.exports = { getUPSClient };
