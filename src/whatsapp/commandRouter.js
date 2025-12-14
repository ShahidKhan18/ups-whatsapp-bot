const { helloCommand } = require("../commands/hello.command");
const { helpCommand } = require("../commands/help.command");
const { loginCommand } = require("../commands/login.command");
const { statusCommand } = require("../commands/status.command");

async function routeCommand(client, msg, text) {
    const [command, ...args] = text.split(/\s+/);

    switch (command.toLowerCase()) {
        case "hello":
            return helloCommand(client, msg);

        case "help":
            return helpCommand(client, msg);

        case "login":
            return loginCommand(client, msg, args);

        case "status":
            return statusCommand(client, msg, args);

        default:
            return msg.reply(
                "❓ Unknown command\nType *help* to see available commands"
            );
    }
}

module.exports = { routeCommand };
