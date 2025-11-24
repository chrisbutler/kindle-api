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
var _KindleBook_client, _KindleBook_version;
export class KindleBook {
    constructor(options, client, version) {
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "authors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "imageUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "asin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "originType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mangaOrComicAsin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "webReaderUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "resourceType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _KindleBook_client.set(this, void 0);
        _KindleBook_version.set(this, void 0);
        this.title = options.title;
        this.authors = KindleBook.normalizeAuthors(options.authors);
        this.imageUrl = options.productUrl;
        this.asin = options.asin;
        this.originType = options.originType;
        this.resourceType = options.resourceType;
        this.mangaOrComicAsin = options.mangaOrComicAsin;
        this.webReaderUrl = options.webReaderUrl;
        this.productUrl = options.productUrl;
        __classPrivateFieldSet(this, _KindleBook_client, client, "f");
        __classPrivateFieldSet(this, _KindleBook_version, version ?? "2000010", "f");
    }
    /**
     * Basic details about the book.
     * If you need progress information you need to
     * call {@link KindleBook#fullDetails}
     * @returns
     */
    async details() {
        const response = await __classPrivateFieldGet(this, _KindleBook_client, "f").request(`https://read.amazon.com/service/mobile/reader/startReading?asin=${this.asin}&clientVersion=${__classPrivateFieldGet(this, _KindleBook_version, "f")}`);
        const info = JSON.parse(response.body);
        return {
            title: this.title,
            asin: this.asin,
            authors: this.authors,
            bookType: info.isSample ? "sample" : info.isOwned ? "owned" : "unknown",
            formatVersion: info.formatVersion,
            mangaOrComicAsin: this.mangaOrComicAsin,
            originType: this.originType,
            /** deprecated */
            productUrl: this.productUrl,
            coverUrl: this.productUrl,
            largeCoverUrl: KindleBook.toLargeImage(this.productUrl),
            metadataUrl: info.metadataUrl,
            progress: {
                reportedOnDevice: info.lastPageReadData.deviceName,
                position: info.lastPageReadData.position,
                syncDate: new Date(info.lastPageReadData.syncTime),
            },
            webReaderUrl: this.webReaderUrl,
            srl: info.srl,
        };
    }
    /**
     * Gets detailed information about the book.
     * Fires 2 http requests under the hood if previous details not given.
     */
    async fullDetails(partialDetails) {
        const info = partialDetails ?? (await this.details());
        const response = await __classPrivateFieldGet(this, _KindleBook_client, "f").request(info.metadataUrl);
        const meta = __classPrivateFieldGet(this, _KindleBook_client, "f").parseJsonpResponse(response);
        if (!meta) {
            throw Error("Something went wrong fetching book metadata");
        }
        const roughDecimal = ((meta.startPosition ?? 0) + info.progress.position) / meta.endPosition;
        // rounding 0.996 to 1
        const percentageRead = Number(roughDecimal.toFixed(3)) * 100;
        return {
            ...info,
            percentageRead,
            releaseDate: meta.releaseDate,
            startPosition: meta.startPosition,
            endPosition: meta.endPosition,
            publisher: meta.publisher,
        };
    }
    static normalizeAuthors(rawAuthors) {
        if (rawAuthors.length === 0) {
            return [];
        }
        const [rawAuthor] = rawAuthors;
        // Kindle API truly has the most cursed authors data structure of all time
        return Array.from(new Set(rawAuthor.split(":").filter(Boolean)), (name) => {
            const [lastName, firstName] = name
                .split(",")
                .map((elems) => elems.trim());
            // sometimes an author only has one name like "Maddox"
            if (!firstName) {
                return {
                    firstName: lastName,
                    lastName: "",
                };
            }
            return {
                firstName,
                lastName,
            };
        });
    }
    static toLargeImage(url) {
        return url.replace(/\._SY\d+_\./g, ".");
    }
}
_KindleBook_client = new WeakMap(), _KindleBook_version = new WeakMap();
