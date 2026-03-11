/**
 * @vitest-environment node
 */

import { RibbonStorage } from '../storage';
import { describe, expect, it } from 'vitest';

describe('[node] Storage', () => {
  it('should bail if window is not defined', () => {
    // Just validating we don't crash due to window not being defined
    expect(RibbonStorage).toBeDefined();
  });
});
