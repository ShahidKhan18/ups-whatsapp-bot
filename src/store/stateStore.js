const states = new Map();

function getState(ip) {
    return states.get(ip);
}

function setState(ip, state) {
    states.set(ip, state);
}

module.exports = { getState, setState };
