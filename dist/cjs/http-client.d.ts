import { TLSClientRequestPayload, TLSClientResponseData } from "./tls-client-api.js";
export declare const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";
/**
 * HTTPClient for doing http requests
 * Can be initialized with a custom CycleTLSClient
 */
export declare class HttpClient {
    private readonly cookies;
    private readonly clientOptions;
    private sessionId?;
    private adpSessionId?;
    constructor(cookies: KindleRequiredCookies, clientOptions: TlsClientConfig);
    private _request;
    request(url: string, payload?: TLSClientRequestPayload): Promise<TLSClientResponseData>;
    parseJsonpResponse<T>(response: TLSClientResponseData): T | undefined;
    updateSession(id: string): void;
    updateAdpSession(id: string): void;
    getSessionId(): string | undefined;
    getAdpSessionId(): string | undefined;
    extractSetCookies(response: TLSClientResponseData): Record<string, string>;
    serializeCookies(): string;
}
export type KindleRequiredCookies = {
    ubidMain: string;
    atMain: string;
    sessionId: string;
    xMain: string;
};
export type TlsClientConfig = {
    url: string;
    apiKey: string;
};
