async function helpCommand(client, msg) {
    await msg.reply(
        `📘 *UPS WhatsApp Bot Commands*

• hello
  → Check server health

• login <ip> [user] [password]
  → Login to UPS (default: user / 111111)

• status <ip>
  → Get complete UPS status

• help
  → Show this help
`
    );
}

module.exports = { helpCommand };
