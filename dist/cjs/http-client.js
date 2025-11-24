"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = exports.USER_AGENT = void 0;
exports.USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";
const JSONP_REGEX = /\(({.*})\)/;
/**
 * HTTPClient for doing http requests
 * Can be initialized with a custom CycleTLSClient
 */
class HttpClient {
    constructor(cookies, clientOptions) {
        Object.defineProperty(this, "cookies", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cookies
        });
        Object.defineProperty(this, "clientOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: clientOptions
        });
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "adpSessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async _request(url, payload) {
        const headers = {
            Cookie: this.serializeCookies(),
            "Accept-Language": "en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7",
            "User-Agent": exports.USER_AGENT,
            ...payload?.headers,
        };
        if (this.sessionId) {
            headers["x-amzn-sessionid"] = this.sessionId;
        }
        if (this.adpSessionId) {
            headers["x-adp-session-token"] = this.adpSessionId;
        }
        const body = JSON.stringify({
            tlsClientIdentifier: "chrome_112",
            requestUrl: url,
            requestMethod: "GET",
            withDebug: true,
            headers,
        }, null, 2);
        return fetch(`${this.clientOptions.url}/api/forward`, {
            method: "POST",
            body,
            headers: {
                "x-api-key": this.clientOptions.apiKey,
            },
        });
    }
    async request(url, payload) {
        const response = await this._request(url, payload);
        const json = await response.json();
        return json;
    }
    parseJsonpResponse(response) {
        const content = response.body.match(JSONP_REGEX)?.[1];
        if (!content) {
            return;
        }
        return JSON.parse(content);
    }
    updateSession(id) {
        this.sessionId = id;
    }
    updateAdpSession(id) {
        this.adpSessionId = id;
    }
    getSessionId() {
        return this.sessionId;
    }
    getAdpSessionId() {
        return this.adpSessionId;
    }
    extractSetCookies(response) {
        return response.cookies;
    }
    serializeCookies() {
        return Object.entries(this.cookies)
            .map(([key, value]) => `${key.replace(/[A-Z]/g, (v) => `-${v.toLowerCase()}`)}=${value}`)
            .join("; ")
            .trim();
    }
}
exports.HttpClient = HttpClient;
