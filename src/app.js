import { initWhatsApp } from "./whatsapp/client.js";
import { startScheduler } from "./monitor/scheduler.js";
import { bootstrapUPSLogin } from "./ups/bootstrap.js";

async function startApp() {
    console.log("🚀 Starting UPS WhatsApp Bot...");

    await initWhatsApp();          // WhatsApp first
    await bootstrapUPSLogin();     // 🔥 NEW: auto login both UPS
    startScheduler();              // monitoring starts

    console.log("✅ Bot fully started");
}

startApp().catch(err => {
    console.error("❌ Fatal startup error:", err);
});
