"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUrl = exports.fetchBooks = void 0;
const book_js_1 = require("./book.js");
const kindle_js_1 = require("./kindle.js");
async function fetchBooks(client, url, version) {
    const resp = await client.request(url);
    const newCookies = client.extractSetCookies(resp);
    const sessionId = newCookies["session-id"];
    const body = JSON.parse(resp.body);
    return {
        books: body.itemsList.map((book) => new book_js_1.KindleBook(book, client, version)),
        sessionId,
        paginationToken: body.paginationToken,
    };
}
exports.fetchBooks = fetchBooks;
function toUrl(query, filter) {
    const url = new URL(kindle_js_1.Kindle.BOOKS_URL);
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
exports.toUrl = toUrl;
