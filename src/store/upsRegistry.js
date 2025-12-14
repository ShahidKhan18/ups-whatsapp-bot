const upsSet = new Set();

function registerUPS(ip) {
    upsSet.add(ip);
}

function getAllUPS() {
    return [...upsSet];
}

module.exports = { registerUPS, getAllUPS };
