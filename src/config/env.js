export const ENV = {
    NODE_ENV: process.env.NODE_ENV || "development",

    // Polling interval (seconds)
    POLL_INTERVAL: Number(process.env.POLL_INTERVAL || 30),

    // HTTP timeout (ms)
    HTTP_TIMEOUT: Number(process.env.HTTP_TIMEOUT || 5000),
};
