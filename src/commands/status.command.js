const { fetchUPSStatus } = require("../ups/status.service");
const { formatStatus } = require("../utils/formatter");
const { DEFAULTS } = require("../config/defaults");

async function statusCommand(client, msg, args) {
    const [ip] = args;

    if (!ip) {
        return msg.reply("❌ Usage: status <ip>");
    }

    const data = await fetchUPSStatus(ip, {
        user: DEFAULTS.UPS.USERNAME,
        password: DEFAULTS.UPS.PASSWORD,
    });

    await msg.reply(formatStatus(ip, data));
}

module.exports = { statusCommand };
