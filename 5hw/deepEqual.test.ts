import { deepEqual } from './deepEqual';

describe('deepEqual', () => {
  it('should not throw for identical objects', () => {
    const obj = { a: { b: 1 } };
    expect(() => deepEqual(obj, obj)).not.toThrow();
  });

  it('should not throw for deeply equal objects', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { b: 1 } };
    expect(() => deepEqual(obj1, obj2)).not.toThrow();
  });

  it('should throw for different primitive', () => {
    expect(() => deepEqual(1, 2)).toThrow('');
  });

  it('should throw for different nested value', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { b: 2 } };
    expect(() => deepEqual(obj1, obj2)).toThrow('a.b');
  });

  it('should throw for different keys', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 1 };
    expect(() => deepEqual(obj1, obj2)).toThrow('[keys]');
  });

  it('should throw for different array length', () => {
    expect(() => deepEqual([1, 2], [1])).toThrow('[length]');
  });

  it('should throw for different array element', () => {
    expect(() => deepEqual([1, 2], [1, 3])).toThrow('1');
  });

  it('should not throw for deeply equal arrays', () => {
    expect(() => deepEqual([1, { a: 2 }], [1, { a: 2 }])).not.toThrow();
  });
}); 