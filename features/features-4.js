/**
 * MicroSIS.ai — FeaturesBlock Interactive Tabs Controller (shadcn/features-4.tsx runtime)
 *
 * Implements Radix UI Tabs keyboard & pointer interactions:
 * - Click / Enter / Space to switch tabs (collaboration | automation | security)
 * - ArrowLeft / ArrowRight / Home / End keyboard navigation across triggers
 * - Synchronizes aria-selected and data-state="active"|"inactive" on triggers & panels
 */
(function () {
  'use strict';

  function activateTab(tabsRoot, targetValue, focusTrigger) {
    if (!tabsRoot || !targetValue) return;

    var triggers = tabsRoot.querySelectorAll('.f4-tab-trigger[data-tab-value]');
    var panels = tabsRoot.querySelectorAll('.f4-tab-content[data-tab-content]');

    triggers.forEach(function (btn) {
      var isMatch = btn.getAttribute('data-tab-value') === targetValue;
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      btn.setAttribute('data-state', isMatch ? 'active' : 'inactive');
      btn.setAttribute('tabindex', isMatch ? '0' : '-1');
      btn.classList.toggle('active', isMatch);
      if (isMatch && focusTrigger) {
        btn.focus();
      }
    });

    panels.forEach(function (panel) {
      var isMatch = panel.getAttribute('data-tab-content') === targetValue;
      panel.setAttribute('data-state', isMatch ? 'active' : 'inactive');
      panel.classList.toggle('active', isMatch);
      if (isMatch) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', 'hidden');
      }
    });
  }

  function initFeatures4Tabs() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.f4-tab-trigger[data-tab-value]');
      if (!trigger) return;
      var tabsRoot = trigger.closest('.f4-tabs');
      if (!tabsRoot) return;
      e.preventDefault();
      activateTab(tabsRoot, trigger.getAttribute('data-tab-value'), false);
    });

    document.addEventListener('keydown', function (e) {
      var trigger = e.target.closest('.f4-tab-trigger[data-tab-value]');
      if (!trigger) return;
      var tabsRoot = trigger.closest('.f4-tabs');
      if (!tabsRoot) return;

      var triggers = Array.prototype.slice.call(
        tabsRoot.querySelectorAll('.f4-tab-trigger[data-tab-value]')
      );
      var idx = triggers.indexOf(trigger);
      if (idx === -1) return;

      var nextIdx = -1;
      if (e.key === 'ArrowRight') {
        nextIdx = (idx + 1) % triggers.length;
      } else if (e.key === 'ArrowLeft') {
        nextIdx = (idx - 1 + triggers.length) % triggers.length;
      } else if (e.key === 'Home') {
        nextIdx = 0;
      } else if (e.key === 'End') {
        nextIdx = triggers.length - 1;
      }

      if (nextIdx !== -1) {
        e.preventDefault();
        var nextTrigger = triggers[nextIdx];
        activateTab(
          tabsRoot,
          nextTrigger.getAttribute('data-tab-value'),
          true
        );
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeatures4Tabs);
  } else {
    initFeatures4Tabs();
  }
})();
