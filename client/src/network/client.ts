import { HTTPRequest } from ".";
import { APIInterfaceRequest, APIInterfaceType } from "./types";

/**
 * A convenient API client object that provides methods for common HTTP verbs.
 * Each method internally calls the `HTTPRequest` function, automatically setting
 * the appropriate HTTP method. This client also benefits from the token
 * refresh logic implemented in `HTTPRequest`.
 *
 * @type {APIInterfaceType}
 */
const api: APIInterfaceType = {
  /**
   * Sends a GET request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {APIInterfaceRequest} options - Request options (query, headers).
   * @returns {Promise<any>} The response data.
   */
  get: async (endpoint: string, options: APIInterfaceRequest = {}) =>
    HTTPRequest(endpoint, { ...options, method: "GET" }),
  /**
   * Sends a POST request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {APIInterfaceRequest} options - Request options (body, query, headers).
   * @returns {Promise<any>} The response data.
   */
  post: (endpoint: string, options: APIInterfaceRequest = {}) =>
    HTTPRequest(endpoint, { ...options, method: "POST" }),
  /**
   * Sends a PUT request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {APIInterfaceRequest} options - Request options (body, query, headers).
   * @returns {Promise<any>} The response data.
   */
  put: (endpoint: string, options: APIInterfaceRequest = {}) =>
    HTTPRequest(endpoint, { ...options, method: "PUT" }),
  /**
   * Sends a PATCH request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {APIInterfaceRequest} options - Request options (body, query, headers).
   * @returns {Promise<any>} The response data.
   */
  patch: (endpoint: string, options: APIInterfaceRequest = {}) =>
    HTTPRequest(endpoint, { ...options, method: "PATCH" }),
  /**
   * Sends a DELETE request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {APIInterfaceRequest} options - Request options (query, headers).
   * @returns {Promise<any>} The response data.
   */
  delete: (endpoint: string, options: APIInterfaceRequest = {}) =>
    HTTPRequest(endpoint, { ...options, method: "DELETE" }),
};

export default api;
