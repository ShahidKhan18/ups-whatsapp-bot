import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { ENV } from "../config/env.js";

export function createHttpClient(baseURL, cookieJar) {
    const jar = cookieJar || new CookieJar();

    const client = wrapper(
        axios.create({
            baseURL,
            timeout: ENV.HTTP_TIMEOUT,
            withCredentials: true,
            validateStatus: () => true, // UPS does not use HTTP codes properly
        })
    );

    client.defaults.jar = jar;

    return { client, jar };
}
