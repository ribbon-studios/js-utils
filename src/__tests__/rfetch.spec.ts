import { describe, it, expect, vi, MockInstance, beforeEach } from 'vitest';
import { rfetch, type RibbonFetchError } from '../rfetch';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

describe('utils(Fetch)', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  const mockFetch = (overrides?: DeepPartial<Response>) => {
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

      expect(fetchSpy).toHaveBeenCalledWith(new URL(expectedUrl, location.origin), {
        method: 'GET',
      });
    });

    it('should support absolute requests', async () => {
      const expectedUrl = 'https://ribbonstudios.com';

      await rfetch(expectedUrl);

      expect(fetchSpy).toHaveBeenCalledWith(new URL(expectedUrl), {
        method: 'GET',
      });
    });

    it('should support the URL type', async () => {
      const expectedUrl = new URL('https://ribbonstudios.com');

      await rfetch(expectedUrl);

      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, {
        method: 'GET',
      });
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

      expect(fetchSpy).toHaveBeenCalledWith(url, {
        method: 'GET',
      });
    });

    it('should support json requests', async () => {
      const expectedRequest = {
        hello: 'world',
      };

      await rfetch('https://ribbonstudios.com', {
        method: 'POST',
        body: expectedRequest,
      });

      expect(fetchSpy).toHaveBeenCalledWith(new URL('https://ribbonstudios.com'), {
        method: 'POST',
        body: JSON.stringify(expectedRequest),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should support already stringified json requests', async () => {
      const expectedRequest = JSON.stringify({
        hello: 'world',
      });

      await rfetch('https://ribbonstudios.com', {
        method: 'POST',
        body: expectedRequest,
      });

      expect(fetchSpy).toHaveBeenCalledWith(new URL('https://ribbonstudios.com'), {
        method: 'POST',
        body: expectedRequest,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should support form data requests', async () => {
      const expectedRequest = new FormData();

      await rfetch('https://ribbonstudios.com', {
        method: 'POST',
        body: expectedRequest,
      });

      expect(fetchSpy).toHaveBeenCalledWith(new URL('https://ribbonstudios.com'), {
        method: 'POST',
        body: expectedRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    });

    it('should ignore get requests with a body', async () => {
      const expectedRequest = {
        hello: 'world',
      };

      await rfetch('https://ribbonstudios.com', {
        body: expectedRequest,
      });

      expect(fetchSpy).toHaveBeenCalledWith(new URL('https://ribbonstudios.com'), {
        method: 'GET',
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

  describe('fn(rfetch.get)', () => {
    it('should be a shorthand for get requests', async () => {
      await rfetch.get('https://ribbonstudios.com');

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('fn(rfetch.put)', () => {
    it('should be a shorthand for put requests', async () => {
      await rfetch.put('https://ribbonstudios.com');

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });

  describe('fn(rfetch.post)', () => {
    it('should be a shorthand for post requests', async () => {
      await rfetch.post('https://ribbonstudios.com');

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('fn(rfetch.patch)', () => {
    it('should be a shorthand for patch requests', async () => {
      await rfetch.patch('https://ribbonstudios.com');

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });

  describe('fn(rfetch.remove)', () => {
    it('should be a shorthand for delete requests', async () => {
      await rfetch.remove('https://ribbonstudios.com');

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
