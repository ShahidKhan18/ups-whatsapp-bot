const { loginUPS } = require("../ups/login.service");
const { registerUPS } = require("../store/upsRegistry");
const { catchAsyncError } = require("../utils/catchAsyncError");

const loginCommand = catchAsyncError(async (client, msg, args) => {
    const [ip, user = "user", password = "111111"] = args;

    if (!ip) {
        return msg.reply("❌ Usage: login <ip> [user] [password]");
    }

    const res = await loginUPS(ip, user, password);

    if (!res.success) {
        // Show specific error message if available
        const errorMsg = res.message || `❌ Login failed for UPS ${ip}`;
        return msg.reply(errorMsg);
    }

    registerUPS(ip);
    await msg.reply(`✅ Logged in to UPS ${ip}`);
}, { errorPrefix: "LOGIN_COMMAND", notifyWhatsApp: false });

module.exports = { loginCommand };
