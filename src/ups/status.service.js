const { getUPSClient } = require("./upsClient");
const { loginUPS } = require("./login.service");
const { DEFAULTS } = require("../config/defaults");
const { catchAsyncError } = require("../utils/catchAsyncError");

const fetchUPSStatus = catchAsyncError(async (ip, creds) => {
    const { client } = getUPSClient(ip);

    let res = await client.get("/_com/home/home.json");

    // Session expired → HTML instead of JSON
    if (typeof res.data !== "object") {
        const loginRes = await loginUPS(
            ip,
            creds.user,
            creds.password
        );

        if (!loginRes.success) {
            throw new Error("LOGIN_FAILED");
        }

        res = await client.get("/_com/home/home.json");
    }

    return res.data;
}, { errorPrefix: "STATUS" });

module.exports = { fetchUPSStatus };
