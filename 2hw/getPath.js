// getPath.js
// Функция для поиска уникального CSS-селектора для элемента

// Простая функция экранирования для CSS-селекторов
function escapeCss(ident) {
  // Экранирует спецсимволы для CSS-селектора
  return ident.replace(/([ #;,.+*~\':!^$\[\]()=>|\/@])/g, '\\$1');
}

function getPath(element) {
  if (!(element instanceof element.ownerDocument.defaultView.HTMLElement)) {
    throw new Error('Argument must be an HTMLElement');
  }
  const document = element.ownerDocument;
  if (element.id) {
    // Проверяем уникальность id
    if (document.querySelectorAll(`#${escapeCss(element.id)}`).length === 1) {
      return `#${escapeCss(element.id)}`;
    }
  }
  // Рекурсивно строим путь
  function getSelector(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id && document.querySelectorAll(`#${escapeCss(el.id)}`).length === 1) {
      return `#${escapeCss(el.id)}`;
    }
    let selector = el.tagName.toLowerCase();
    if (el.className) {
      const classes = Array.from(el.classList).map(cls => `.${escapeCss(cls)}`).join('');
      selector += classes;
    }
    // Если у родителя есть такие же элементы, добавляем :nth-child
    if (el.parentNode) {
      const siblings = Array.from(el.parentNode.children).filter(e => e.tagName === el.tagName);
      if (siblings.length > 1) {
        const index = Array.from(el.parentNode.children).indexOf(el) + 1;
        selector += `:nth-child(${index})`;
      }
    }
    return selector;
  }
  let path = [];
  let el = element;
  while (el && el.nodeType === 1 && el.tagName.toLowerCase() !== 'html') {
    path.unshift(getSelector(el));
    const selector = path.join(' > ');
    if (document.querySelectorAll(selector).length === 1) {
      return selector;
    }
    el = el.parentElement;
  }
  return path.join(' > ');
}

module.exports = getPath; 