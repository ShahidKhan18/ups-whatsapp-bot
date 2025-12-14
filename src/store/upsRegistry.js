const upsSet = new Set();

export function registerUPS(ip) {
    upsSet.add(ip);
}

export function getAllUPS() {
    return [...upsSet];
}
