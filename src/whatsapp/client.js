const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { handleMessage } = require("./messageHandler");

let client;

async function initWhatsApp() {
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

function getClient() {
    return client;
}

module.exports = { initWhatsApp, getClient };
