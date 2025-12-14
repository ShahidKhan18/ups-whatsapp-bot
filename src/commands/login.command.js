export async function loginCommand(client, msg, args) {
    const [ip, user = "user", password = "111111"] = args;

    if (!ip) {
        return msg.reply("❌ Usage: login <ip> [user] [password]");
    }

    // TODO: call UPS login service
    await msg.reply(`🔐 Login requested for UPS ${ip}`);
}
