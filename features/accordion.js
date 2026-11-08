/**
 * MicroSIS.ai · Accordion runtime (vanilla port of components/ui/accordion.tsx,
 * which wraps @radix-ui/react-accordion).
 *
 * Mirrors Radix behaviour:
 *  - type "single" (one open at a time) or "multiple"; "collapsible" lets the open item close
 *  - Header (h3) > button[aria-expanded][aria-controls] + region[aria-labelledby]
 *  - data-state="open|closed" on item, trigger and content; closed content gets [hidden]
 *  - --radix-accordion-content-height drives the accordion-down / accordion-up animation
 *  - ArrowDown / ArrowUp / Home / End move focus between triggers
 *
 * Upgrades the existing FAQ markup (.faq-list > .faq-item > .faq-question + .faq-answer)
 * in place, and any author markup using [data-accordion].
 * Fires a bubbling "accordion:open" CustomEvent on the item when it opens.
 */
(function () {
  'use strict';

  // @radix-ui/react-icons ChevronDownIcon (15×15 grid)
  var CHEVRON =
    '<svg class="acc-chevron" width="16" height="16" viewBox="0 0 15 15" fill="none" aria-hidden="true" focusable="false">' +
    '<path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/></svg>';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uid = 0;

  function setState(item, open, animate) {
    var trigger = item.__accTrigger;
    var content = item.__accContent;
    var state = open ? 'open' : 'closed';

    item.setAttribute('data-state', state);
    trigger.setAttribute('data-state', state);
    trigger.setAttribute('aria-expanded', String(open));
    content.removeEventListener('animationend', content.__accEnd || function () {});

    if (open) {
      content.hidden = false;
      content.style.setProperty('--radix-accordion-content-height', content.scrollHeight + 'px');
      content.setAttribute('data-state', 'open');
      content.style.animation = !animate || reduceMotion ? 'none' : '';
    } else {
      content.style.setProperty('--radix-accordion-content-height', content.scrollHeight + 'px');
      content.setAttribute('data-state', 'closed');
      if (!animate || reduceMotion) {
        content.hidden = true;
        content.style.animation = 'none';
      } else {
        content.style.animation = '';
        content.__accEnd = function () {
          if (item.getAttribute('data-state') === 'closed') content.hidden = true;
        };
        content.addEventListener('animationend', content.__accEnd, { once: true });
      }
    }
  }

  function toggle(root, item) {
    var isOpen = item.getAttribute('data-state') === 'open';
    var single = root.__accType === 'single';

    if (isOpen) {
      if (single && !root.__accCollapsible) return;
      setState(item, false, true);
      return;
    }
    if (single) {
      root.__accItems.forEach(function (other) {
        if (other !== item && other.getAttribute('data-state') === 'open') setState(other, false, true);
      });
    }
    setState(item, true, true);
    item.dispatchEvent(new CustomEvent('accordion:open', { bubbles: true, detail: { index: root.__accItems.indexOf(item) } }));
  }

  function upgradeItem(root, item) {
    var legacy = item.classList.contains('faq-item');
    var trigger = item.querySelector(legacy ? '.faq-question' : '[data-accordion-trigger]');
    var content = item.querySelector(legacy ? '.faq-answer' : '[data-accordion-content]');
    if (!trigger || !content) return null;

    var id = 'acc-' + (++uid);
    var wasOpen = legacy ? item.classList.contains('open') : item.hasAttribute('data-open');

    // Item
    item.classList.remove('faq-item', 'open');
    item.classList.add('acc-item');

    // Header (h3) > Trigger
    var header = document.createElement('h3');
    header.className = 'acc-header';
    trigger.parentNode.insertBefore(header, trigger);
    header.appendChild(trigger);
    trigger.classList.remove('faq-question');
    trigger.classList.add('acc-trigger');
    trigger.type = 'button';
    trigger.id = id + '-trigger';
    trigger.setAttribute('aria-controls', id + '-content');
    var legacyIcon = trigger.querySelector('.faq-icon');
    if (legacyIcon) legacyIcon.remove();
    if (!trigger.querySelector('.acc-chevron')) trigger.insertAdjacentHTML('beforeend', CHEVRON);

    // Content > inner
    content.classList.remove('faq-answer');
    content.classList.add('acc-content');
    content.id = id + '-content';
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', trigger.id);
    if (!content.querySelector(':scope > .acc-inner')) {
      var inner = document.createElement('div');
      inner.className = 'acc-inner';
      while (content.firstChild) inner.appendChild(content.firstChild);
      content.appendChild(inner);
    }

    item.__accTrigger = trigger;
    item.__accContent = content;
    setState(item, wasOpen, false);

    trigger.addEventListener('click', function () { toggle(root, item); });
    trigger.addEventListener('keydown', function (e) {
      var triggers = root.__accItems.map(function (it) { return it.__accTrigger; });
      var i = triggers.indexOf(trigger);
      var next = null;
      if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
      else if (e.key === 'ArrowUp') next = triggers[(i - 1 + triggers.length) % triggers.length];
      else if (e.key === 'Home') next = triggers[0];
      else if (e.key === 'End') next = triggers[triggers.length - 1];
      if (next) { e.preventDefault(); next.focus(); }
    });
    return item;
  }

  function upgrade(root) {
    if (root.__accReady) return;
    root.__accReady = true;
    root.classList.add('acc-root');
    root.__accType = root.getAttribute('data-accordion') === 'multiple' ? 'multiple' : 'single';
    root.__accCollapsible = root.hasAttribute('data-accordion') ? root.hasAttribute('data-collapsible') : true;

    var items = Array.prototype.slice.call(root.querySelectorAll(':scope > .faq-item, :scope > [data-accordion-item]'));
    root.__accItems = items.map(function (it) { return upgradeItem(root, it); }).filter(Boolean);

    // single: keep at most one item open
    if (root.__accType === 'single') {
      var seen = false;
      root.__accItems.forEach(function (it) {
        if (it.getAttribute('data-state') === 'open') {
          if (seen) setState(it, false, false);
          seen = true;
        }
      });
    }
  }

  function init() {
    document.querySelectorAll('.faq-list, [data-accordion]').forEach(upgrade);
  }

  window.MicroSISAccordion = { init: init, upgrade: upgrade };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
