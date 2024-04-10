[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![CI Build][github-actions-image]][github-actions-url]
[![Maintainability][maintainability-image]][maintainability-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]
[![Code Style: Prettier][code-style-image]][code-style-url]

</div>

# JS Utils 🔧

Collection of generic javascript utilities curated by the Rainbow Cafe~

- [Promises](#promises)
  - [`delay`](#delay)
    - [`delay.fallback`](#delayfallback)
  - [`assert`](#assert)
    - [`assert.defined`](#assertdefined)
  - [`never`](#never)

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
[maintainability-image]: https://img.shields.io/codeclimate/maintainability/ribbon-studios/refreshly
[maintainability-url]: https://codeclimate.com/github/ribbon-studios/refreshly/maintainability
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079
