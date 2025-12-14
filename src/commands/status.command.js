export async function statusCommand(client, msg, args) {
    const [ip] = args;

    if (!ip) {
        return msg.reply("❌ Usage: status <ip>");
    }

    // TODO: call UPS status service
    await msg.reply(`📊 Fetching UPS status for ${ip}`);
}
