// getPath.test.js
const getPath = require('./getPath');
const { JSDOM } = require('jsdom');

describe('getPath', () => {
  let document;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><body>
      <div id="unique"></div>
      <div class="container">
        <ul>
          <li class="item">First</li>
          <li class="item">Second</li>
        </ul>
      </div>
      <section>
        <span class="foo bar"></span>
      </section>
    </body>`);
    document = dom.window.document;
  });

  it('should return unique selector for element with id', () => {
    const el = document.getElementById('unique');
    const selector = getPath(el);
    expect(document.querySelector(selector)).toBe(el);
    expect(document.querySelectorAll(selector).length).toBe(1);
  });

  it('should return unique selector for element with class', () => {
    const el = document.querySelector('.foo.bar');
    const selector = getPath(el);
    expect(document.querySelector(selector)).toBe(el);
    expect(document.querySelectorAll(selector).length).toBe(1);
  });

  it('should return unique selector for nested element', () => {
    const el = document.querySelector('.container ul li.item');
    const selector = getPath(el);
    expect(document.querySelector(selector)).toBe(el);
    expect(document.querySelectorAll(selector).length).toBe(1);
  });

  it('should return unique selector for :nth-child', () => {
    const el = document.querySelector('.container ul li.item:last-child');
    const selector = getPath(el);
    expect(document.querySelector(selector)).toBe(el);
    expect(document.querySelectorAll(selector).length).toBe(1);
  });
}); 