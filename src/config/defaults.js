const DEFAULTS = {
    UPS: {
        USERNAME: "user",
        PASSWORD: "111111",
        PROTOCOL: "http",
        IPS: [
            "10.0.190.201",
            "10.0.190.202",
        ],
    },

    LOGIN: {
        MAX_RETRY: 2,
    },

    VOLTAGE: {
        MIN_LN: 180,
        MAX_LN: 260,
    },
};

module.exports = { DEFAULTS };
