const { fetchUPSStatus } = require("../ups/status.service");
const { formatStatus } = require("../utils/formatter");
const { DEFAULTS } = require("../config/defaults");
const { catchAsyncError } = require("../utils/catchAsyncError");
const { generateStatusHTML, saveHTMLToFile } = require("../utils/htmlGenerator");
const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

const statusCommand = catchAsyncError(async (client, msg, args) => {
    const [ip, format = "text"] = args;

    if (!ip) {
        return msg.reply("❌ Usage: status <ip> [format]\n\nFormats:\n- text (default)\n- html (detailed report)");
    }

    const data = await fetchUPSStatus(ip, {
        user: DEFAULTS.UPS.USERNAME,
        password: DEFAULTS.UPS.PASSWORD,
    });

    if (format.toLowerCase() === "html") {
        // Generate HTML report
        const html = generateStatusHTML(ip, data);
        const filepath = saveHTMLToFile(html, ip);

        // Send HTML file
        const media = MessageMedia.fromFilePath(filepath);
        await client.sendMessage(msg.from, media, {
            caption: `📊 UPS Status Report for ${ip}\n⏰ ${new Date().toLocaleString()}`
        });

        // Clean up temp file after sending
        setTimeout(() => {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }, 5000);
    } else {
        // Send text format (original)
        await msg.reply(formatStatus(ip, data));
    }
}, { errorPrefix: "STATUS_COMMAND", notifyWhatsApp: false });

module.exports = { statusCommand };
