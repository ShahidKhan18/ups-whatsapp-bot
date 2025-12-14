const { getUPSClient } = require("./upsClient");
const { DEFAULTS } = require("../config/defaults");
const { setCookie } = require("../store/cookieStore");

async function loginUPS(ip, user, password) {
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
        return { success: false };
    }

    setCookie(ip, sidCookie.value);

    return { success: true };
}

module.exports = { loginUPS };
