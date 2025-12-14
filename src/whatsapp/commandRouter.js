import { helloCommand } from "../commands/hello.command.js";
import { helpCommand } from "../commands/help.command.js";
import { loginCommand } from "../commands/login.command.js";
import { statusCommand } from "../commands/status.command.js";

export async function routeCommand(client, msg, text) {
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
