const { getUPSClient } = require("./upsClient");
const { DEFAULTS } = require("../config/defaults");
const { setCookie } = require("../store/cookieStore");
const { pingUPS } = require("../utils/http");
const { catchAsyncError } = require("../utils/catchAsyncError");

const loginUPS = catchAsyncError(async (ip, user, password) => {
    // Check if UPS is reachable before attempting login
    const pingResult = await pingUPS(ip, DEFAULTS.UPS.PROTOCOL);

    if (!pingResult.success) {
        const errorMsg = `UPS is down or unreachable (${pingResult.error})`;
        console.error(`[LOGIN ERROR] IP: ${ip} | Error: ${errorMsg}`);
        return {
            success: false,
            error: "UPS_DOWN",
            message: `❌ ${errorMsg}`
        };
    }

    const { client, jar } = getUPSClient(ip);

    const payload = new URLSearchParams({
        UserName: user,
        Pswd: password,
    });

    const res = await client.post("/SignIn.cgi", payload.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const cookies = await jar.getCookies(`http://${ip}`);
    const sidCookie = cookies.find(c => c.key === "SID");

    if (!sidCookie) {
        const errorMsg = "Invalid credentials or authentication failed";
        console.error(`[LOGIN ERROR] IP: ${ip} | User: ${user} | Error: ${errorMsg}`);
        return {
            success: false,
            error: "AUTH_FAILED",
            message: `❌ ${errorMsg}`
        };
    }

    setCookie(ip, sidCookie.value);
    console.log(`[LOGIN SUCCESS] IP: ${ip} | User: ${user}`);

    return { success: true };
}, { errorPrefix: "LOGIN" });

module.exports = { loginUPS };
