export type RibbonFetchOptions = {
  method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';
  params?: Record<string, any>;
  body?: any;
  headers?: HeadersInit;
} & Omit<RequestInit, 'body' | 'headers' | 'method'>;

export type RibbonFetchBasicOptions = Omit<RibbonFetchOptions, 'method' | 'body'>;

export type RibbonFetchBodyOptions = Omit<RibbonFetchOptions, 'method'>;

export type RibbonFetchError<R> = {
  status: number;
  content: R;
};

export type RibbonFetchInterceptor = (url: URL, options: RequestInit) => RequestInit | Promise<RequestInit>;

export enum DelimiterType {
  COMMA,
  DUPLICATE,
}

let fetchInterceptors: RibbonFetchInterceptor[] = [];
let delimiter: DelimiterType = DelimiterType.DUPLICATE;

/**
 * A lightweight wrapper around fetch to simplify its usage.
 *
 * @param url The url you wish to fetch.
 * @param options The request options.
 * @returns The typed response or an error containing the `status` and the `content`
 */
export async function rfetch<T = any>(
  url: string | URL,
  { params, body, ...options }: RibbonFetchOptions = {}
): Promise<T> {
  const requestInit: RequestInit = {
    method: 'GET',
    ...options,
  };

  // Standardize our url to the `URL` type
  const internalURL = url instanceof URL ? url : new URL(url, url.startsWith('/') ? location.origin : undefined);

  // Apply the query params to the url.
  if (params) {
    for (const [key, values] of Object.entries(params)) {
      if (Array.isArray(values)) {
        switch (delimiter) {
          case DelimiterType.COMMA:
            internalURL.searchParams.set(key, values.map((value) => value.toString()).join(','));
            break;
          case DelimiterType.DUPLICATE:
            values.forEach((value) => {
              internalURL.searchParams.append(key, value.toString());
            });
            break;
        }
      } else {
        internalURL.searchParams.append(key, values.toString());
      }
    }
  }

  // Dynamically determine the content-type based upon the data provided to us.
  if (requestInit.method !== 'GET' && body) {
    if (body instanceof FormData) {
      requestInit.body = body;
      requestInit.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    } else if (typeof body === 'string') {
      requestInit.body = body;
      requestInit.headers = {
        'Content-Type': 'application/json',
      };
    } else {
      requestInit.body = JSON.stringify(body);
      requestInit.headers = {
        'Content-Type': 'application/json',
      };
    }
  }

  const response = await fetch(
    internalURL,
    await fetchInterceptors.reduce(
      async (output, interceptor) => await interceptor(internalURL, await output),
      Promise.resolve(requestInit)
    )
  );

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

  export async function delimiters(type: DelimiterType) {
    delimiter = type;
  }

  export const interceptors = {
    add(interceptor: RibbonFetchInterceptor) {
      fetchInterceptors.push(interceptor);
    },

    remove(interceptor: RibbonFetchInterceptor) {
      const index = fetchInterceptors.indexOf(interceptor);

      if (index === -1) return;

      fetchInterceptors.splice(index, 1);
    },

    clear() {
      fetchInterceptors = [];
    },
  };
}
