import { KindleBook } from "./book.js";
import { KindleRequiredCookies, HttpClient, TlsClientConfig } from "./http-client.js";
import { Filter, Query } from "./query-filter.js";
export type { KindleBook, KindleBookDetails, KindleBookData, KindleBookLightDetails, KindleAuthor, } from "./book.js";
export type { KindleOwnedBookMetadataResponse, KindleBookMetadataResponse, } from "./book-metadata.js";
export { HttpClient, type KindleRequiredCookies, type TlsClientConfig, } from "./http-client.js";
export type { TLSClientRequestPayload, TLSClientResponseData, } from "./tls-client-api.js";
export type KindleConfiguration = {
    /**
     * Cookie string copied from your browser or exact
     * requried cookies
     */
    cookies: KindleRequiredCookies | string;
    deviceToken: string;
    clientVersion?: string;
    tlsServer: TlsClientConfig;
    /**
     * Factory that creates or returns a custom instance of http client.
     */
    clientFactory?: (cookies: KindleRequiredCookies, clientOptions: TlsClientConfig) => HttpClient;
    /**
     * Set the number of results to return for initial book fetch.
     * Default is 50.
     */
    querySize?: number;
};
export type KindleOptions = {
    config: KindleConfiguration;
    sessionId: string;
};
export type KindleFromCookieOptions = {
    cookieString: string;
    deviceToken: string;
};
export declare class Kindle {
    #private;
    private options;
    static DEVICE_TOKEN_URL: string;
    static readonly BOOKS_URL = "https://read.amazon.com/kindle-library/search?query=&libraryType=BOOKS";
    static readonly DEFAULT_QUERY: Readonly<{
        sortType: "recency";
    }>;
    static readonly DEFAULT_FILTER: Readonly<{
        querySize: number;
        fetchAllPages: false;
    }>;
    /**
     * The default list of books fetched when setting up {@link Kindle}
     *
     * We need to hit up the books endpoint to get necessary cookies
     * so we save the initial response here just to make sure the
     * user doesn't have to run the same request twice for no reason
     */
    readonly defaultBooks: KindleBook[];
    constructor(options: KindleOptions, client: HttpClient, prePopulatedBooks?: KindleBook[]);
    static fromConfig(config: KindleConfiguration): Promise<Kindle>;
    static deviceToken(client: HttpClient, token: string): Promise<KindleDeviceInfo>;
    static baseRequest(client: HttpClient, version?: string, args?: {
        query?: Query;
        filter?: Filter;
    }): Promise<{
        books: KindleBook[];
        sessionId: string;
    }>;
    books(args?: {
        query?: Query;
        filter?: Filter;
    }): Promise<KindleBook[]>;
    static deserializeCookies(cookies: string): KindleRequiredCookies;
}
export interface KindleDeviceInfo {
    clientHashId: string;
    deviceName: string;
    deviceSessionToken: string;
    eid: string;
}
