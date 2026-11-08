/**
 * MicroSIS.ai · Stacked Dialog runtime (vanilla port of components/ui/stacked-dialog.tsx)
 *
 * Mirrors DialogStack / DialogStackTrigger / DialogStackOverlay / DialogStackBody /
 * DialogStackContent / DialogStackNext / DialogStackPrevious:
 *  - activeIndex state, totalDialogs = number of steps
 *  - previous cards translateY(-n * offset) and shrink by n * 10px, upcoming cards opacity 0
 *  - only the active card's inner content is interactive
 *  - overlay click closes; clickable=true lets you click a peeking card to jump back
 * Additions for the static site: Escape closes, focus moves into the stack and returns
 * to the trigger on close.
 */
(function () {
  'use strict';

  var ARROW =
    '<svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true"%CLS%><path d="M6.98298 6.19679C7.90428 5.66488 7.90428 4.33509 6.98298 3.80318L1.00704 0.352971C0.516375 0.0696831 -0.00492265 0.671685 0.345598 1.11682V1.11682C2.13943 3.39485 2.13943 6.60512 0.345598 8.88315V8.88315C-0.00492251 9.32828 0.516376 9.93029 1.00704 9.647L6.98298 6.19679Z"/></svg>';

  var STACKS = {
    rollout: {
      label: '5-Day Production Rollout Protocol',
      offset: 10,
      clickable: true,
      avatar: '/logo/microsis-mark.svg',
      steps: [
        {
          eyebrow: 'Day 01',
          title: 'Boundary & VPC Peering',
          description: 'Your perimeter, your keys.',
          content:
            '<ul><li>AWS PrivateLink, Azure Private Link, or GCP Private Service Connect</li>' +
            '<li>Customer-managed encryption keys (AWS KMS, Azure Key Vault, Cloud KMS)</li>' +
            '<li>Air-gapped Helm deployment for sovereign enclaves</li></ul>'
        },
        {
          eyebrow: 'Day 02',
          title: 'Schema & Policy Binding',
          description: 'Contracts before traffic.',
          content:
            '<ul><li>Target JSON Schema / Protobuf contracts bound to your workspace</li>' +
            '<li>HL7 FHIR R4 templates for clinical payloads</li>' +
            '<li>Vidura statutory guardrails attached per engine</li></ul>'
        },
        {
          eyebrow: 'Day 03',
          title: 'Shadow-Mode Backtesting',
          description: 'Proven on your history first.',
          content:
            '<ul><li>Parallel evaluation against historical production payloads</li>' +
            '<li>Field precision, latency, and SHAP stability verified side by side</li>' +
            '<li>No live routing until every benchmark clears</li></ul>'
        },
        {
          eyebrow: 'Day 05',
          title: 'Production Cutover & Audit Ledger',
          description: 'Live, with evidence attached.',
          content:
            '<ul><li>Endpoints promoted to active routing</li>' +
            '<li>Automated SIEM telemetry to Splunk, Sentinel, and Datadog</li>' +
            '<li>Cryptographic compliance evidence recorded from the first request</li></ul>'
        },
        {
          eyebrow: 'Next step',
          title: 'Plan your rollout',
          description: '30 minutes with a principal architect.',
          content:
            '<p style="margin:0">We map your boundary, schemas, and audit requirements to this protocol and provision an isolated evaluation sandbox.</p>' +
            '<a class="sd-cta" href="/demo.html" data-page-link="demo" data-sd-close>Schedule a briefing ' +
            '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>'
        }
      ]
    }
  };

  var state = null; // { cfg, activeIndex, overlay, body, cards, trigger }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render() {
    if (!state) return;
    var offset = state.cfg.offset || 10;
    var total = state.cards.length;
    state.cards.forEach(function (card, index) {
      var distance = index - state.activeIndex;
      var abs = Math.abs(distance);
      var isActive = distance === 0;
      card.classList.toggle('is-active', isActive);
      card.style.top = '0';
      card.style.transform = 'translateY(' + (distance < 0 ? '-' : '') + abs * offset + 'px)';
      card.style.width = 'calc(100% - ' + abs * 10 + 'px)';
      card.style.zIndex = String(50 - abs);
      card.style.position = distance ? 'absolute' : 'relative';
      card.style.opacity = distance > 0 ? '0' : '1';
      card.style.cursor = state.cfg.clickable && state.activeIndex > index ? 'pointer' : 'default';
      card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      card.inert = !isActive;

      var prev = card.querySelector('[data-sd-prev]');
      var next = card.querySelector('[data-sd-next]');
      if (prev) prev.disabled = state.activeIndex <= 0;
      if (next) next.disabled = state.activeIndex >= total - 1;
    });
  }

  function focusActive() {
    var card = state && state.cards[state.activeIndex];
    if (!card) return;
    var target = card.querySelector('[data-sd-next]:not(:disabled), .sd-cta, [data-sd-prev]:not(:disabled)');
    if (target) target.focus({ preventScroll: true });
  }

  function go(index) {
    if (!state) return;
    var total = state.cards.length;
    if (index < 0 || index > total - 1 || index === state.activeIndex) return;
    state.activeIndex = index;
    render();
    focusActive();
  }

  function close() {
    if (!state) return;
    state.overlay.remove();
    state.body.remove();
    document.removeEventListener('keydown', onKey, true);
    var trigger = state.trigger;
    state = null;
    if (trigger) trigger.focus({ preventScroll: true });
  }

  function onKey(e) {
    if (!state) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  function open(key, trigger) {
    var cfg = STACKS[key];
    if (!cfg || state) return;

    var overlay = document.createElement('div');
    overlay.className = 'sd-overlay';
    overlay.setAttribute('data-state', 'open');
    overlay.addEventListener('click', close);

    var body = document.createElement('div');
    body.className = 'sd-body';
    body.setAttribute('role', 'dialog');
    body.setAttribute('aria-modal', 'true');
    body.setAttribute('aria-label', cfg.label);

    var stack = document.createElement('div');
    stack.className = 'sd-stack';

    var total = cfg.steps.length;
    var cards = cfg.steps.map(function (step, index) {
      var card = document.createElement('div');
      card.className = 'sd-card';
      card.innerHTML =
        '<div class="sd-card-inner">' +
          '<div class="sd-header">' +
            '<span class="sd-avatar"><img src="' + cfg.avatar + '" alt="MicroSIS.ai"></span>' +
            '<div>' +
              '<span class="sd-eyebrow">' + esc(step.eyebrow) + '</span>' +
              '<h2 class="sd-title">' + esc(step.title) + '</h2>' +
              '<p class="sd-desc">' + esc(step.description) + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="sd-content">' + step.content + '</div>' +
          '<div class="sd-footer">' +
            '<span class="sd-step">' + (index + 1) + ' / ' + total + '</span>' +
            '<button type="button" class="sd-nav" data-sd-prev>' + ARROW.replace('%CLS%', ' class="sd-flip"') + ' Previous</button>' +
            '<button type="button" class="sd-nav" data-sd-next>Next ' + ARROW.replace('%CLS%', '') + '</button>' +
          '</div>' +
        '</div>';

      card.addEventListener('click', function (e) {
        if (e.target.closest('[data-sd-prev]')) { go(state.activeIndex - 1); return; }
        if (e.target.closest('[data-sd-next]')) { go(state.activeIndex + 1); return; }
        if (e.target.closest('[data-sd-close]')) { close(); return; }
        if (cfg.clickable && state && state.activeIndex > index) go(index);
      });

      stack.appendChild(card);
      return card;
    });

    body.appendChild(stack);
    document.body.appendChild(overlay);
    document.body.appendChild(body);

    state = { cfg: cfg, activeIndex: 0, overlay: overlay, body: body, cards: cards, trigger: trigger };
    render();
    document.addEventListener('keydown', onKey, true);
    requestAnimationFrame(focusActive);
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-sd-open]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger.getAttribute('data-sd-open'), trigger);
  });

  window.MicroSISStackedDialog = { open: open, close: close, stacks: STACKS };
})();
