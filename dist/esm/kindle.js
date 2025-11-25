var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Kindle_client;
import { fetchBooks, toUrl } from "./fetch-books.js";
import { HttpClient, } from "./http-client.js";
export { HttpClient, } from "./http-client.js";
export class Kindle {
    constructor(options, client, 
    // not necessary for initialization (if called from the outside)
    // so we're leaving this nullable
    prePopulatedBooks) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        /**
         * The default list of books fetched when setting up {@link Kindle}
         *
         * We need to hit up the books endpoint to get necessary cookies
         * so we save the initial response here just to make sure the
         * user doesn't have to run the same request twice for no reason
         */
        Object.defineProperty(this, "defaultBooks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _Kindle_client.set(this, void 0);
        this.defaultBooks = prePopulatedBooks ?? [];
        __classPrivateFieldSet(this, _Kindle_client, client, "f");
    }
    static async fromConfig(config) {
        const cookies = typeof config.cookies === "string"
            ? Kindle.deserializeCookies(config.cookies)
            : config.cookies;
        const client = config.clientFactory?.(cookies, config.tlsServer) ??
            new HttpClient(cookies, config.tlsServer);
        const { sessionId, books } = await Kindle.baseRequest(client, undefined, {
            filter: { querySize: config.querySize ?? 50 },
        });
        client.updateSession(sessionId);
        const deviceInfo = await Kindle.deviceToken(client, config.deviceToken);
        client.updateAdpSession(deviceInfo.deviceSessionToken);
        return new this({
            config: {
                ...config,
                cookies,
            },
            sessionId,
        }, client, books);
    }
    static async deviceToken(client, token) {
        const params = new URLSearchParams({
            serialNumber: token,
            deviceType: token,
        });
        const url = `${Kindle.DEVICE_TOKEN_URL}?${params.toString()}`;
        const response = await client.request(url);
        return JSON.parse(response.body);
    }
    static async baseRequest(client, version, args) {
        const query = {
            ...Kindle.DEFAULT_QUERY,
            ...args?.query,
        };
        const filter = {
            ...Kindle.DEFAULT_FILTER,
            ...args?.filter,
        };
        let allBooks = [];
        let latestSessionId;
        // loop until we get less than the requested amount of books or hit the limit
        do {
            const url = toUrl(query, filter);
            const { books, sessionId, paginationToken } = await fetchBooks(client, url, version);
            latestSessionId = sessionId;
            allBooks = [...allBooks, ...books];
            // update offset
            filter.paginationToken = paginationToken;
        } while (filter.paginationToken !== undefined &&
            filter.fetchAllPages === true);
        return {
            books: allBooks,
            sessionId: latestSessionId,
        };
    }
    async books(args) {
        const result = await Kindle.baseRequest(__classPrivateFieldGet(this, _Kindle_client, "f"), undefined, args);
        // refreshing the internal session every time books is called.
        // This doesn't prevent us from calling the books endpoint but
        // it does prevent requesting the metadata of individual books
        this.options.sessionId = result.sessionId;
        return result.books;
    }
    static deserializeCookies(cookies) {
        const values = cookies
            .split(";")
            .map((v) => v.split("="))
            .reduce((acc, [key, value]) => {
            acc[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim());
            return acc;
        }, {});
        return {
            atMain: values["at-main"],
            sessionId: values["session-id"],
            ubidMain: values["ubid-main"],
            xMain: values["x-main"],
        };
    }
}
_Kindle_client = new WeakMap();
Object.defineProperty(Kindle, "DEVICE_TOKEN_URL", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "https://read.amazon.com/service/web/register/getDeviceToken"
});
Object.defineProperty(Kindle, "BOOKS_URL", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "https://read.amazon.com/kindle-library/search?query=&libraryType=BOOKS"
});
Object.defineProperty(Kindle, "DEFAULT_QUERY", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Object.freeze({
        sortType: "recency",
    })
});
Object.defineProperty(Kindle, "DEFAULT_FILTER", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Object.freeze({
        querySize: 50,
        fetchAllPages: false,
    })
});
