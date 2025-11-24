import { Scenario } from "../scenario.js";
import { sample1, sample2, sample3 } from "./fixtures/books.js";
import { defaultRequestBody } from "./fixtures/default-request-body.js";
import { sessionToken } from "./fixtures/tokens.js";

export const customQuerySize = {
  customQuerySize: {
    request: {
      method: "post",
      url: "http://localhost:8080/api/forward",
      body: {
        ...defaultRequestBody,
        requestUrl:
          "https://read.amazon.com/kindle-library/search?query=&libraryType=BOOKS&sortType=acquisition_desc&querySize=25",
        headers: {
          ...defaultRequestBody.headers,
          "x-amzn-sessionid": "2",
          "x-adp-session-token": sessionToken,
        },
      },
    },
    response: {
      headers: {},
      status: 200,
      body: {
        cookies: {
          "session-id": "2",
        },
        body: JSON.stringify({
          itemsList: [sample1, sample2, sample3],
        }),
      },
      meta: {
        books: [sample1, sample2, sample3],
      },
    },
  },
} satisfies Scenario;
