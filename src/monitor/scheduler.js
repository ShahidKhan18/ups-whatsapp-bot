const cron = require("node-cron");
const { getAllUPS } = require("../store/upsRegistry");
const { fetchUPSStatus } = require("../ups/status.service");
const { evaluateState } = require("../ups/stateEngine");
const { getState, setState } = require("../store/stateStore");
const { notify } = require("./notifier");
const { getClient } = require("../whatsapp/client");
const { formatModeChange, formatVoltageAlert } = require("../utils/formatter");
const { ENV } = require("../config/env");
const { DEFAULTS } = require("../config/defaults");

function startScheduler() {
    cron.schedule(`*/${ENV.POLL_INTERVAL} * * * * *`, async () => {
        for (const ip of getAllUPS()) {
            try {
                const data = await fetchUPSStatus(ip, {
                    user: DEFAULTS.UPS.USERNAME,
                    password: DEFAULTS.UPS.PASSWORD,
                });

                const prev = getState(ip);
                const result = evaluateState(prev, data);

                setState(ip, result.state);

                const client = getClient();
                for (const event of result.events) {
                    if (event.type === "MODE_CHANGE" || event.type === "RECOVERY") {
                        await notify(
                            client,
                            process.env.ADMIN_CHAT_ID,
                            formatModeChange(ip, event.from, event.to)
                        );
                    }

                    if (event.type === "VOLTAGE_ABNORMAL") {
                        await notify(
                            client,
                            process.env.ADMIN_CHAT_ID,
                            formatVoltageAlert(ip, "ALL", event.voltages, "Abnormal")
                        );
                    }
                }
            } catch (err) {
                console.error("Scheduler error:", err.message);
            }
        }
    });

    console.log("⏱ UPS monitoring scheduler running");
}

module.exports = { startScheduler };
