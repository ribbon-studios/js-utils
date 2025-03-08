import { describe, it, expect, vi, MockInstance, Mocked, beforeEach } from 'vitest';
import { rfetch, type RibbonFetchError } from '../rfetch';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

describe('utils(Fetch)', () => {
  let fetchSpy: MockInstance<[input: RequestInfo | URL, init?: RequestInit], Promise<Response>>;

  const mockFetch = (overrides?: DeepPartial<Mocked<Response>>) => {
    fetchSpy.mockResolvedValue({
      ok: true,
      text: vi.fn(),
      json: vi.fn(),
      ...overrides,
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
        ...overrides?.headers,
      } as unknown as Headers,
    } as unknown as Response);
  };

  beforeEach(() => {
    fetchSpy = vi.spyOn(window, 'fetch');
    mockFetch();
  });

  describe('fn(rfetch)', () => {
    it('should support relative requests', async () => {
      const expectedUrl = '/hello/world';

      await rfetch(expectedUrl);

      expect(fetchSpy).toHaveBeenCalledWith(new URL(expectedUrl, location.origin), expect.anything());
    });

    it('should support absolute requests', async () => {
      const expectedUrl = 'https://ribbonstudios.com';

      await rfetch(expectedUrl);

      expect(fetchSpy).toHaveBeenCalledWith(new URL(expectedUrl), expect.anything());
    });

    it('should support the URL type', async () => {
      const expectedUrl = new URL('https://ribbonstudios.com');

      await rfetch(expectedUrl);

      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.anything());
    });

    it('should support query params', async () => {
      const expectedUrl = 'https://ribbonstudios.com';

      await rfetch(expectedUrl, {
        params: {
          ribbon: 'studios',
          hello: ['world', 'welt'],
        },
      });

      const url = new URL(expectedUrl);
      url.searchParams.set('ribbon', 'studios');
      url.searchParams.append('hello', 'world');
      url.searchParams.append('hello', 'welt');

      expect(fetchSpy).toHaveBeenCalledWith(url, expect.anything());
    });

    it('should support json requests', async () => {
      const expectedRequest = {
        hello: 'world',
      };

      await rfetch('https://ribbonstudios.com', {
        body: expectedRequest,
      });

      expect(fetchSpy).toHaveBeenCalledWith(expect.any(URL), {
        method: 'GET',
        body: JSON.stringify(expectedRequest),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should support form data requests', async () => {
      const expectedRequest = new FormData();

      await rfetch('https://ribbonstudios.com', {
        body: expectedRequest,
      });

      expect(fetchSpy).toHaveBeenCalledWith(expect.any(URL), {
        method: 'GET',
        body: expectedRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    });

    it('should support json responses', async () => {
      const expectedResponse = {
        hello: 'world',
      };

      mockFetch({
        json: vi.fn().mockResolvedValue(expectedResponse),
      });

      await expect(rfetch('https://ribbonstudios.com')).resolves.toEqual(expectedResponse);
    });

    it('should support text responses', async () => {
      const expectedResponse = {
        hello: 'world',
      };

      mockFetch({
        text: vi.fn().mockResolvedValue(expectedResponse),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      });

      await expect(rfetch('https://ribbonstudios.com')).resolves.toEqual(expectedResponse);
    });

    it('should support errors', async () => {
      const expectedResponse = {
        hello: 'world',
      };

      mockFetch({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue(expectedResponse),
      });

      await expect(rfetch('https://ribbonstudios.com')).rejects.toEqual({
        status: 500,
        content: expectedResponse,
      } satisfies RibbonFetchError<typeof expectedResponse>);
    });

    it('should support errors', async () => {
      const expectedResponse = {
        hello: 'world',
      };

      mockFetch({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue(expectedResponse),
      });

      await expect(rfetch('https://ribbonstudios.com')).rejects.toEqual({
        status: 500,
        content: expectedResponse,
      });
    });
  });
});
