type RibbonFetchParamType = string | number | boolean;

export type RibbonFetchOptions = {
  method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';
  params?: Record<string, RibbonFetchParamType | RibbonFetchParamType[]>;
  body?: any;
  headers?: HeadersInit;
} & Omit<RequestInit, 'body' | 'headers' | 'method'>;

export type RibbonFetchBasicOptions = Omit<RibbonFetchOptions, 'method' | 'body'>;

export type RibbonFetchBodyOptions = Omit<RibbonFetchOptions, 'method'>;

export type RibbonFetchError<R> = {
  status: number;
  content: R;
};

/**
 * A lightweight wrapper around fetch to simplify its usage.
 *
 * @param url The url you wish to fetch.
 * @param options The request options.
 * @returns The typed response or an error containing the `status` and the `content`
 */
export async function rfetch<T = any>(url: string | URL, options?: RibbonFetchOptions): Promise<T> {
  const requestInit: RequestInit = {
    method: options?.method ?? 'GET',
  };

  // Standardize our url to the `URL` type
  const internalURL = url instanceof URL ? url : new URL(url, url.startsWith('/') ? location.origin : undefined);

  // Apply the query params to the url.
  if (options?.params) {
    for (const [key, values] of Object.entries(options.params)) {
      if (Array.isArray(values)) {
        for (const value of values) {
          internalURL.searchParams.append(key, value.toString());
        }
      } else {
        internalURL.searchParams.append(key, values.toString());
      }
    }
  }

  // Dynamically determine the content-type based upon the data provided to us.
  if (requestInit.method !== 'GET' && options?.body) {
    if (options.body instanceof FormData) {
      requestInit.body = options.body;
      requestInit.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...requestInit.headers,
      };
    } else if (typeof options.body === 'string') {
      requestInit.body = options.body;
      requestInit.headers = {
        'Content-Type': 'application/json',
        ...requestInit.headers,
      };
    } else {
      requestInit.body = JSON.stringify(options.body);
      requestInit.headers = {
        'Content-Type': 'application/json',
        ...requestInit.headers,
      };
    }
  }

  const response = await fetch(internalURL, requestInit);

  // Dynamically determine the content we received and parse it accordingly.
  const content = response.headers.get('Content-Type')?.toLowerCase()?.includes('json')
    ? await response.json()
    : await response.text();

  if (response.ok) {
    return content;
  }

  return Promise.reject({
    status: response.status,
    content,
  } satisfies RibbonFetchError<any>);
}

/* c8 ignore start */
export namespace rfetch {
  /* c8 ignore end */

  /**
   * Shorthand method for a GET request
   *
   * @param url The url you wish to fetch.
   * @param options The request options.
   * @returns The typed response or an error containing the `status` and the `content`
   */
  export async function get<T>(url: string | URL, options?: RibbonFetchBasicOptions) {
    return rfetch<T>(url, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Shorthand method for a PUT request
   *
   * @param url The url you wish to fetch.
   * @param options The request options.
   * @returns The typed response or an error containing the `status` and the `content`
   */
  export async function put<T>(url: string | URL, options?: RibbonFetchBodyOptions) {
    return rfetch<T>(url, {
      ...options,
      method: 'PUT',
    });
  }

  /**
   * Shorthand method for a POST request
   *
   * @param url The url you wish to fetch.
   * @param options The request options.
   * @returns The typed response or an error containing the `status` and the `content`
   */
  export async function post<T>(url: string | URL, options?: RibbonFetchBodyOptions) {
    return rfetch<T>(url, {
      ...options,
      method: 'POST',
    });
  }

  /**
   * Shorthand method for a PATCH request
   *
   * @param url The url you wish to fetch.
   * @param options The request options.
   * @returns The typed response or an error containing the `status` and the `content`
   */
  export async function patch<T>(url: string | URL, options?: RibbonFetchBodyOptions) {
    return rfetch<T>(url, {
      ...options,
      method: 'PATCH',
    });
  }

  /**
   * Shorthand method for a DELETE request
   *
   * @param url The url you wish to fetch.
   * @param options The request options.
   * @returns The typed response or an error containing the `status` and the `content`
   * @note This is named `remove` purely because `delete` is a reserved key
   */
  export async function remove<T>(url: string | URL, options?: RibbonFetchBodyOptions) {
    return rfetch<T>(url, {
      ...options,
      method: 'DELETE',
    });
  }
}
