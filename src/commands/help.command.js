async function helpCommand(client, msg) {
    await msg.reply(
        `📘 *UPS WhatsApp Bot Commands*

• hello
  → Check server health

• login <ip> [user] [password]
  → Login to UPS (default: user / 111111)

• status <ip> [format]
  → Get UPS status
  → Formats: text (default) | html (detailed)
  → Example: status 10.0.190.201 html

• help
  → Show this help
`
    );
}

module.exports = { helpCommand };
