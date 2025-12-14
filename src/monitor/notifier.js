async function notify(client, chatId, message) {
    if (!client || !chatId) return;
    await client.sendMessage(chatId, message);
}

module.exports = { notify };
