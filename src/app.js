const { initWhatsApp } = require("./whatsapp/client");
const { startScheduler } = require("./monitor/scheduler");

async function bootstrap() {
    await initWhatsApp();
    startScheduler();
}

bootstrap();
