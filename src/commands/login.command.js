const { loginUPS } = require("../ups/login.service");
const { registerUPS } = require("../store/upsRegistry");

async function loginCommand(client, msg, args) {
    const [ip, user = "user", password = "111111"] = args;

    if (!ip) {
        return msg.reply("❌ Usage: login <ip> [user] [password]");
    }

    const res = await loginUPS(ip, user, password);

    if (!res.success) {
        return msg.reply(`❌ Login failed for UPS ${ip}`);
    }

    registerUPS(ip);
    await msg.reply(`✅ Logged in to UPS ${ip}`);
}

module.exports = { loginCommand };
