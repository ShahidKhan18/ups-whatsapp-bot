export async function notify(client, chatId, message) {
    await client.sendMessage(chatId, message);
}
