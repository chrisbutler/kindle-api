export interface KindleOwnedBookMetadataResponse {
    YJFormatVersion: string;
    clippingLimit: number;
    contentType: string;
    contentVersion: string;
    deliveredAsin: string;
    format: string;
    formatVersion: string;
    hasAnnotations: boolean;
    isOwned: boolean;
    isSample: boolean;
    kindleSessionId: string;
    lastPageReadData: {
        deviceName: string;
        position: number;
        syncTime: number;
    };
    manifestUrl: null | string;
    metadataUrl: string;
    originType: string;
    pageNumberUrl: null | string;
    requestedAsin: string;
    srl: number;
}
export interface KindleBookMetadataResponse {
    ACR: string;
    asin: string;
    startPosition: number;
    endPosition: number;
    releaseDate: string;
    title: string;
    version: string;
    sample: boolean;
    authorList: string[];
    publisher: string;
}
