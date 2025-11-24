import { HttpClient } from "./http-client.js";
export declare class KindleBook {
    #private;
    readonly title: string;
    readonly authors: KindleAuthor[];
    readonly imageUrl: string;
    readonly asin: string;
    readonly originType: string;
    readonly productUrl: string;
    readonly mangaOrComicAsin: boolean;
    readonly webReaderUrl: string;
    readonly resourceType: string;
    constructor(options: KindleBookData, client: HttpClient, version?: string);
    /**
     * Basic details about the book.
     * If you need progress information you need to
     * call {@link KindleBook#fullDetails}
     * @returns
     */
    details(): Promise<KindleBookLightDetails>;
    /**
     * Gets detailed information about the book.
     * Fires 2 http requests under the hood if previous details not given.
     */
    fullDetails(partialDetails?: KindleBookLightDetails): Promise<KindleBookDetails>;
    static normalizeAuthors(rawAuthors: string[]): KindleAuthor[];
    static toLargeImage(url: string): string;
}
export interface KindleAuthor {
    /**
     * A first name also includes (if applicable)
     * both given and middle names
     */
    firstName: string;
    lastName: string;
}
export interface KindleBookData {
    title: string;
    asin: string;
    authors: string[];
    mangaOrComicAsin: boolean;
    resourceType: "EBOOK" | "EBOOK_SAMPLE" | (string & {});
    originType: string;
    percentageRead: number;
    productUrl: string;
    webReaderUrl: string;
}
export interface KindleBookLightDetails {
    title: string;
    bookType: "owned" | "sample" | "unknown";
    mangaOrComicAsin: boolean;
    formatVersion: string;
    progress: {
        reportedOnDevice: string;
        position: number;
        syncDate: Date;
    };
    asin: string;
    originType: string;
    authors: KindleAuthor[];
    /** @deprecated use {@link KindleBookLightDetails#coverUrl} */
    productUrl: string;
    /**
     * Heavily compressed image url of the book cover, use {@link KindleBookLightDetails#largeCoverUrl} for a better quality
     */
    coverUrl: string;
    largeCoverUrl: string;
    webReaderUrl: string;
    srl: number;
    metadataUrl: string;
}
export interface KindleBookDetails extends KindleBookLightDetails {
    publisher?: string;
    releaseDate: string;
    startPosition: number;
    endPosition: number;
    percentageRead: number;
}
