const { VOLTAGE_LIMITS } = require("../constants/thresholds");
const { MODES } = require("../constants/modes");

function evaluateState(prev, curr) {
    const events = [];

    // ---- MODE DETECTION ----
    const getMode = data => {
        if (data.Other.upsSupplyState === "2") return MODES.LINE;
        if (data.Other.upsSupplyState === "1") return MODES.BYPASS;
        return MODES.BATTERY;
    };

    const currentMode = getMode(curr);

    if (!prev || prev.mode !== currentMode) {
        if (prev) {
            if (prev.mode === MODES.BATTERY && currentMode === MODES.LINE) {
                events.push({ type: "RECOVERY", from: prev.mode, to: currentMode });
            } else {
                events.push({ type: "MODE_CHANGE", from: prev.mode, to: currentMode });
            }
        }
    }

    // ---- INPUT VOLTAGE ----
    const voltages = curr.Input.L_N_Volt;
    const abnormal = Object.values(voltages).some(v => {
        const val = Number(v);
        return val < VOLTAGE_LIMITS.MIN || val > VOLTAGE_LIMITS.MAX;
    });

    if (!prev || prev.voltageAbnormal !== abnormal) {
        events.push({
            type: abnormal ? "VOLTAGE_ABNORMAL" : "VOLTAGE_NORMAL",
            voltages,
        });
    }

    return {
        state: {
            mode: currentMode,
            voltageAbnormal: abnormal,
        },
        events,
    };
}

module.exports = { evaluateState };
