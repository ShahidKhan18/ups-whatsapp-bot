function formatStatus(ip, data) {
    const mode =
        data.Other.upsSupplyState === "1"
            ? "Bypass"
            : data.Other.upsSupplyState === "2"
                ? "Inverter"
                : data.Other.upsSupplyState === "3"
                    ? "Union"
                    : "None";

    return (
        `📊 *UPS Status*
🖥 IP: ${ip}

🔌 Mode: ${mode}
🔋 Battery: ${data.Battery.Sta.P} (${data.Battery.Cap}%)
⚡ Load: ${data.Load.LoadPercnt.A}%
🌡 Temp: ${data.Other.envTemp}℃
⚠ Alarms: ${data.Other.Log_CurAlarmCnt}
❌ Faults: ${data.Other.Log_CurFaultCnt}`
    );
}


function formatVoltageAlert(ip, phase, voltage, type) {
    return (
        `⚠️ *Input Voltage ${type}*
🖥 IP: ${ip}
⚡ Phase: ${phase}
🔌 Voltage: ${voltage}V`
    );
}

function formatModeChange(ip, from, to) {
    return (
        `🔔 *UPS Mode Changed*
🖥 IP: ${ip}
🔄 ${from} → ${to}`
    );
}


function formatLoginStatus(ip, success) {
    return success
        ? `✅ Logged in to UPS ${ip}`
        : `❌ Login failed for UPS ${ip}`;
}

module.exports = { formatStatus, formatVoltageAlert, formatModeChange, formatLoginStatus };
