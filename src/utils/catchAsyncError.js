const { getClient } = require("../whatsapp/client");

/**
 * Higher-order function that wraps async functions to handle errors uniformly.
 * 
 * @param {Function} fn - The async function to wrap
 * @param {Object} options - Configuration options
 * @param {boolean} options.notifyWhatsApp - Whether to send error to WhatsApp (default: true)
 * @param {string} options.errorPrefix - Prefix for server logs (default: "ERROR")
 * @returns {Function} - Wrapped async function with error handling
 * 
 * Usage:
 * const wrappedFunction = catchAsyncError(async (arg1, arg2) => {
 *     // your async code
 * });
 */
function catchAsyncError(fn, options = {}) {
    const {
        notifyWhatsApp = true,
        errorPrefix = "ERROR"
    } = options;

    return async function (...args) {
        try {
            return await fn(...args);
        } catch (error) {
            // Log complete error details on server
            console.error(`\n${"=".repeat(80)}`);
            console.error(`[${errorPrefix}] ${new Date().toISOString()}`);
            console.error(`Function: ${fn.name || "anonymous"}`);
            console.error(`Error Name: ${error.name}`);
            console.error(`Error Message: ${error.message}`);
            console.error(`Error Code: ${error.code || "N/A"}`);
            console.error(`Error Stack:\n${error.stack}`);
            console.error(`Arguments:`, JSON.stringify(args, null, 2));
            console.error(`${"=".repeat(80)}\n`);

            // Send error message to WhatsApp if enabled
            if (notifyWhatsApp) {
                try {
                    const client = getClient();
                    if (client) {
                        const errorMsg = `⚠️ *System Error*\n\n` +
                            `Function: ${fn.name || "unknown"}\n` +
                            `Error: ${error.message}\n` +
                            `Time: ${new Date().toLocaleString()}`;

                        await client.sendMessage(process.env.ADMIN_CHAT_ID, errorMsg);
                    }
                } catch (notifyError) {
                    console.error("[NOTIFICATION ERROR]", notifyError.message);
                }
            }

            // Re-throw error or return error object based on function signature
            // If the original function returns an object with 'success' property, return error object
            // Otherwise, re-throw to maintain original behavior
            if (error.message === "LOGIN_FAILED" || error.code) {
                return {
                    success: false,
                    error: error.code || error.name,
                    message: `❌ ${error.message}`
                };
            }

            throw error;
        }
    };
}

module.exports = { catchAsyncError };
