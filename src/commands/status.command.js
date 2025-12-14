const { fetchUPSStatus } = require("../ups/status.service");
const { formatStatus } = require("../utils/formatter");
const { DEFAULTS } = require("../config/defaults");
const { catchAsyncError } = require("../utils/catchAsyncError");

const statusCommand = catchAsyncError(async (client, msg, args) => {
    const [ip] = args;

    if (!ip) {
        return msg.reply("❌ Usage: status <ip>");
    }

    const data = await fetchUPSStatus(ip, {
        user: DEFAULTS.UPS.USERNAME,
        password: DEFAULTS.UPS.PASSWORD,
    });

    await msg.reply(formatStatus(ip, data));
}, { errorPrefix: "STATUS_COMMAND", notifyWhatsApp: false });

module.exports = { statusCommand };
