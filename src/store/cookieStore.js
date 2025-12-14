const cookies = new Map();

function setCookie(ip, cookie) {
    cookies.set(ip, cookie);
}

function getCookie(ip) {
    return cookies.get(ip);
}

module.exports = { setCookie, getCookie };
