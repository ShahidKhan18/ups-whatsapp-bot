import { DEFAULTS } from "../config/defaults.js";

const upsSet = new Set(DEFAULTS.UPS.IPS);

export function registerUPS(ip) {
    upsSet.add(ip);
}

export function getAllUPS() {
    return [...upsSet];
}
