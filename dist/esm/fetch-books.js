import { KindleBook } from "./book.js";
import { Kindle } from "./kindle.js";
export async function fetchBooks(client, url, version) {
    const resp = await client.request(url);
    const newCookies = client.extractSetCookies(resp);
    const sessionId = newCookies["session-id"];
    const body = JSON.parse(resp.body);
    return {
        books: body.itemsList.map((book) => new KindleBook(book, client, version)),
        sessionId,
        paginationToken: body.paginationToken,
    };
}
export function toUrl(query, filter) {
    const url = new URL(Kindle.BOOKS_URL);
    const searchParams = {
        ...query,
        ...filter,
    };
    for (const [key, value] of Object.entries(searchParams)) {
        if (key === "fetchAllPages") {
            continue; // pagination handling is internal only and not part of the kindle api
        }
        if (value !== undefined) {
            url.searchParams.set(key, value.toString());
        }
        else {
            url.searchParams.delete(key);
        }
    }
    return url.toString();
}
