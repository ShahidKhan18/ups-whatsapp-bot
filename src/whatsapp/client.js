import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleMessage } from "./messageHandler.js";

let client;

export async function initWhatsApp() {
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }
    });

    client.on("qr", qr => {
        console.log("📲 Scan WhatsApp QR");
        qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
        console.log("✅ WhatsApp Bot Ready");
    });

    client.on("message", msg => handleMessage(client, msg));

    await client.initialize();
}

export function getClient() {
    return client;
}
