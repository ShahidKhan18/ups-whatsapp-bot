import { routeCommand } from "./commandRouter.js";

export async function handleMessage(client, msg) {
    if (!msg.body) return;

    const text = msg.body.trim();
    if (!text) return;

    await routeCommand(client, msg, text);
}
