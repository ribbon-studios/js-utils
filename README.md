[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![CI Build][github-actions-image]][github-actions-url]
[![Maintainability][maintainability-image]][maintainability-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]
[![Code Style: Prettier][code-style-image]][code-style-url]

</div>

# JS Utils 🔧

Collection of generic javascript utilities curated by the Ribbon Studios Team~

- [Promises](#promises)
  - [`delay`](#delay)
    - [`delay.fallback`](#delayfallback)
  - [`assert`](#assert)
    - [`assert.defined`](#assertdefined)
  - [`never`](#never)
  - [`retry`](#retry)
- [Fetch](#fetch)
  - [`rfetch`](#rfetch)
    - [`rfetch.get`](#rfetchget)
    - [`rfetch.put`](#rfetchput)
    - [`rfetch.post`](#rfetchpost)
    - [`rfetch.patch`](#rfetchpatch)
    - [`rfetch.remove`](#rfetchremove)
    - [`rfetch.interceptors`](#rfetchinterceptors)
    - [`rfetch.delimiters`](#rfetchdelimiters)

## Promises

### `delay`

Creates a delayed promise for the given amount of seconds and given promises.
This can be useful for allowing spinners / loading skeletons to exist for a bit rather then quickly popping in and out.

```tsx
import { delay } from '@ribbon-studios/js-utils';

const promise = delay(); // Returns a promise with the preset delay
const promise = delay(1000); // Returns a promise with the given delay
const promise = delay(Promise.resolve('hello')); // Returns the original promise with the preset delay
const promise = delay(Promise.resolve('hello'), 1000); // Returns the original promise with the given delay
```

### `delay.fallback`

This overrides the default delay value

```tsx
import { delay } from '@ribbon-studios/js-utils';

const promise = delay(); // Returns a promise with a delay of 500ms
delay.fallback(100);
const promise = delay(); // Returns a promise with a delay of 100ms
```

### `assert`

On its own assert isn't overly useful just because of how type assertion works.

```tsx
import { assert } from '@ribbon-studios/js-utils';

export async function example() {
  const promise: Promise<string | undefined> = Promise.resolve('hello');
  // Run an assertion on the promises response
  const assertedPromise: Promise<string | undefined> = assert(promise, (value) => typeof value !== 'undefined');
  // Unfortunately our response is still considered undefined because we can't forward the assertion
}
```

### `assert.defined`

Ensures the promise result is defined.

```tsx
import { assert } from '@ribbon-studios/js-utils';

export async function example() {
  const promise: Promise<string | undefined> = Promise.resolve('hello');

  // Run an assertion on the promises response
  const assertedPromise: Promise<string> = assert.defined(promise);
  // Our promise is no longer considered undefined!

  // You can also pass a message to throw!
  const assertedPromise: Promise<string> = assert.defined(promise, 'Expected our thing to exist!');
}
```

### `never`

Creates a promise that never resolves.
Primary use-case for this is testing loading states.

In the event a promise is passed it will log a warning in the console as a reminder not to leave it in.

```tsx
import { never } from '@ribbon-studios/js-utils';

const promise = never(); // Returns a promise that never resolves
const promise = never(Promise.resolve('hello')); // Returns a promise that never resolves
```

### `retry`

Retries a function `n` times until it resolves successfully.
This can be useful for requests that tend to be flaky.

```tsx
import { retry } from '@ribbon-studios/js-utils';

// Returns a promise that resolves when the request is successful or fails after its exceeded that maximum attempts.
const promise = retry(() => getMaps(), 5);
```

## Fetch

### `rfetch`

Lightweight wrapper around fetch that automatically handles:

- Query Params
- Form Data & JSON bodies
- JSON Responses (fallsback to text)
- Type Casting
- Errors

```tsx
import { rfetch, type RibbonFetchError } from '@ribbon-studios/js-utils';

try {
  const response = await rfetch<MyExpectedResponse>('https://ribbonstudios.com', {
    params: {
      hello: 'world',
    },
    body: {
      hallo: 'welt',
    },
  });

  console.log(response);
  // => MyExpectedResponse
} catch (error: RibbonFetchError<MyExpectedErrorResponse>) {
  console.error(error);
  // => { status: number; content: MyExpectedErrorResponse; }
}
```

### `rfetch.get`

Shorthand for GET requests.

```tsx
import { rfetch, type RibbonFetchError } from '@ribbon-studios/js-utils';

// Shorthand for GET requests.
await rfetch.get<MyExpectedResponse>('https://ribbonstudios.com');
```

### `rfetch.put`

Shorthand for PUT requests.

```tsx
import { rfetch, type RibbonFetchError } from '@ribbon-studios/js-utils';

// Shorthand for PUT requests.
await rfetch.put<MyExpectedResponse>('https://ribbonstudios.com');
```

### `rfetch.post`

Shorthand for POST requests.

```tsx
import { rfetch, type RibbonFetchError } from '@ribbon-studios/js-utils';

// Shorthand for POST requests.
await rfetch.post<MyExpectedResponse>('https://ribbonstudios.com');
```

### `rfetch.patch`

Shorthand for PATCH requests.

```tsx
import { rfetch, type RibbonFetchError } from '@ribbon-studios/js-utils';

// Shorthand for PATCH requests.
await rfetch.patch<MyExpectedResponse>('https://ribbonstudios.com');
```

### `rfetch.remove`

Shorthand for DELETE requests.

```tsx
import { rfetch, type RibbonFetchError } from '@ribbon-studios/js-utils';

// Shorthand for DELETE requests.
await rfetch.remove<MyExpectedResponse>('https://ribbonstudios.com');
```

### `rfetch.interceptors`

Useful for enhancing requests with additional information

```tsx
import { rfetch, type RibbonFetchError } from '@ribbon-studios/js-utils';

const interceptor = (url: URL, options: RequestInit): RequestInit | Promise<RequestInit> => {
  return options; // Return the modified options!
};

rfetch.interceptors.add(interceptor); // Add the interceptor
rfetch.interceptors.remove(interceptor); // Remove the interceptor
rfetch.interceptors.clear(); // Clear all interceptors
```

### `rfetch.delimiters`

Specifies which delimiters should be used.

```tsx
import { rfetch, DelimiterType } from '@ribbon-studios/js-utils';

rfetch.delimiters(DelimiterType.DUPLICATE); // Use duplicate query params

// This is the default functionality
// https://ribbonstudios.com?hello=world&hello=welt
await rfetch.get('https://ribbonstudios.com', {
  params: {
    hello: ['world', 'welt'],
  },
});

rfetch.delimiters(DelimiterType.COMMA); // Use comma separators

// https://ribbonstudios.com?hello=world,welt
await rfetch.get('https://ribbonstudios.com', {
  params: {
    hello: ['world', 'welt'],
  },
});
```

### `rfetch.is.error`

A type guard that helps determine if the error is from a `rfetch` response.

```ts
import { rfetch } from '@ribbon-studios/js-utils';

try {
  await rfetch.get('https://ribbonstudios.com');
} catch (error: any) {
  if (rfetch.is.error(error) && error.status === 404) {
    // Do something!
  }

  throw error;
}
```

[_**Want to Contribute?**_](/CONTRIBUTING.md)

[npm-version-image]: https://img.shields.io/npm/v/@ribbon-studios/js-utils.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/@ribbon-studios/js-utils.svg
[npm-url]: https://npmjs.org/package/@ribbon-studios/js-utils
[github-actions-image]: https://img.shields.io/github/actions/workflow/status/ribbon-studios/js-utils/ci.yml?event=push
[github-actions-url]: https://github.com/ribbon-studios/js-utils/actions/workflows/ci.yml?query=branch%3Amain
[coveralls-image]: https://img.shields.io/coveralls/ribbon-studios/js-utils.svg
[coveralls-url]: https://coveralls.io/github/ribbon-studios/js-utils?branch=main
[code-style-image]: https://img.shields.io/badge/code%20style-prettier-ff69b4.svg
[code-style-url]: https://prettier.io
[maintainability-image]: https://img.shields.io/codeclimate/maintainability/ribbon-studios/js-utils
[maintainability-url]: https://codeclimate.com/github/ribbon-studios/js-utils/maintainability
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079
