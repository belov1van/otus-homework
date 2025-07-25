type Path = string[];

function formatPath(path: Path): string {
  return path.length ? path.join('.') : '';
}

export function deepEqual(actual: any, expected: any, path: Path = []): void {
  if (actual === expected) return;

  if (typeof actual !== typeof expected || actual === null || expected === null) {
    throw new Error(formatPath(path));
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      throw new Error(formatPath(path.concat('[length]')));
    }
    for (let i = 0; i < actual.length; i++) {
      deepEqual(actual[i], expected[i], path.concat(String(i)));
    }
    return;
  }

  if (typeof actual === 'object' && typeof expected === 'object') {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    actualKeys.sort();
    expectedKeys.sort();
    if (actualKeys.join(',') !== expectedKeys.join(',')) {
      throw new Error(formatPath(path.concat('[keys]')));
    }
    for (const key of actualKeys) {
      deepEqual(actual[key], expected[key], path.concat(key));
    }
    return;
  }

  if (actual !== expected) {
    throw new Error(formatPath(path));
  }
} 