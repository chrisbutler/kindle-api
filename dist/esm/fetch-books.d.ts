import { KindleBook } from "./book.js";
import { HttpClient } from "./http-client.js";
import { Query, Filter } from "./query-filter.js";
export declare function fetchBooks(client: HttpClient, url: string, version?: string): Promise<{
    books: KindleBook[];
    sessionId: string;
    paginationToken?: string;
}>;
export declare function toUrl(query: Query, filter: Filter): string;
