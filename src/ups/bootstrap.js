import { loginUPS } from "./login.service.js";
import { DEFAULTS } from "../config/defaults.js";
import { registerUPS } from "../store/upsRegistry.js";

export async function bootstrapUPSLogin() {
    console.log("🔌 Bootstrapping UPS login...");

    for (const ip of DEFAULTS.UPS.IPS) {
        try {
            const res = await loginUPS(
                ip,
                DEFAULTS.UPS.USERNAME,
                DEFAULTS.UPS.PASSWORD
            );

            if (res.success) {
                registerUPS(ip);
                console.log(`✅ UPS login success: ${ip}`);
            } else {
                console.error(`❌ UPS login failed: ${ip}`);
            }
        } catch (err) {
            console.error(`❌ UPS login error (${ip}):`, err.message);
        }
    }

    console.log("🔁 UPS bootstrap completed");
}
