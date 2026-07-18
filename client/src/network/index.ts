"use server";

import { cookies, headers } from "next/headers";
import { HTTPRequestOptionsType } from "./types";
import { ensureProtocol } from "@/lib/helpers";
import { protocol } from "@/config/constants";

const getCookie = async function (key: string): Promise<string> {
  return (await cookies()).get(key)?.value as string;
};

const buildRequestHeaders = async function () {
  const headersList = await headers()
  const origin = headersList.get("origin") ||
    headersList.get("referer") ||
    headersList.get("x-forwarded-host") ||
    ""
  return {
    origin: ensureProtocol(protocol, origin)
  }
}

/**
 * Builds a URL by appending query parameters to an existing URL string.
 * It handles encoding of both keys and values of the query parameters.
 *
 * @param {string} url The base URL to which query parameters will be appended.
 * @param {Record<string, string>} params An object where keys are parameter names and values are their corresponding string values. Defaults to an empty object.
 * @returns {string} The new URL string with the query parameters appended.
 */
const buildUrlWithQueryParams = function (
  url: string,
  params: Record<string, string | number> = {},
) {
  const query = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  return url.includes("?") ? `${url}&${query}` : `${url}?${query}`;
};

/**
 * makeRequest creates and sends an HTTP request over the network.
 * It constructs the full URL, adds authorization and content-type headers,
 * and sends the request using the `fetch` API.
 *
 * @param endpoint The API endpoint to which the request will be sent (e.g., "/users"). This will be appended to NEXT_PUBLIC_BASE_URL.
 * @param options An object containing the HTTP request options, including method, query parameters, body, and additional headers.
 * @param token The authorization token (e.g., JWT) to be included in the 'Authorization' header as a Bearer token.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {Error} If the network request fails or the response cannot be parsed as JSON.
 */
export const makeRequest = async function (
  endpoint: string,
  options: HTTPRequestOptionsType,
  token?: string,
) {
  const url = buildUrlWithQueryParams(
    process.env.NEXT_PUBLIC_BASE_URL + endpoint,
    options.query,
  );
  const cookieList = await cookies()
  const requestHeaders = await buildRequestHeaders()
  // console.log(requestHeaders)
  // console.log({
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Cookie": cookieList.toString(),
  //       ...requestHeaders,
  //       ...options.headers,
  //     },
  //     method: options.method,
  //     body: JSON.stringify(options.body),
  //     "credentials": "include",
  //   })
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookieList.toString(),
      ...requestHeaders,
      ...options.headers,
    },
    method: options.method,
    body: JSON.stringify(options.body),
    "credentials": "include",
  });
  if (options.early) return response
  return await response.json();
};

/**
 * Executes an HTTP request with built-in automatic token refresh logic.
 *
 * This function first attempts to make a request using the current "access" token
 * stored in cookies. If the request fails with a 401 Unauthorized error, it
 * automatically uses the "refresh" token to fetch new access and refresh tokens.
 * After successfully obtaining new tokens and updating the session, it retries
 * the original request.
 *
 * @param {string} endpoint The API endpoint for the request (e.g., "/users").
 * @param {HTTPRequestOptionsType} options The options for the HTTP request, such as method, body, and headers.
 * @returns {Promise<any>} A promise that resolves to the final response data from the API. If the token refresh fails, it returns an object with `code: 401`.
 */
export const HTTPRequest = async function (
  endpoint: string,
  options: HTTPRequestOptionsType,
): Promise<any> {
  const bearerToken = await getCookie("access");

  const data = await makeRequest(endpoint, options, bearerToken);
  if (data && !(data.accessTokenExpired === true)) return data;
  const refreshToken = await getCookie("refresh");

  const dataResponse = await makeRequest(
    "/auth/update-token",
    {
      headers: {
        authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      method: "POST",
      body: JSON.stringify({
        refreshToken,
      }),
    },
    refreshToken,
  );

  if (dataResponse?.code !== 201)
    return {
      code: 401,
    };

  const data2 = await makeRequest(endpoint, options, bearerToken);

  return data2;
};
