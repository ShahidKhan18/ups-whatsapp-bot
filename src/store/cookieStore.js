const cookies = new Map();

export function setCookie(ip, cookie) {
    cookies.set(ip, cookie);
}

export function getCookie(ip) {
    return cookies.get(ip);
}
