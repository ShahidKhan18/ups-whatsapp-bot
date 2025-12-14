import { initWhatsApp } from "./whatsapp/client.js";
import { startScheduler } from "./monitor/scheduler.js";

async function bootstrap() {
    await initWhatsApp();
    startScheduler();
}

bootstrap();
