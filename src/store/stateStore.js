const states = new Map();

export function getState(ip) {
    return states.get(ip);
}

export function setState(ip, state) {
    states.set(ip, state);
}
