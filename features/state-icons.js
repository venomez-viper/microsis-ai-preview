/**
 * MicroSIS.ai · Animated State Icons runtime
 * (vanilla port of components/ui/animated-state-icons.tsx + microsis-state-icons.tsx)
 *
 * <span class="si" data-si="docmind"></span>          → loops between two states
 * <span class="si" data-si="copied" data-si-mode="manual"></span> → flip via MicroSISStateIcons.flash(el)
 *
 * Auto-mounts onto the site:
 *  - product / project cards (.pc-card[data-slug] / [data-pc-project]) → product icon
 *  - Product Suite stat bento (.ps-stat-card)                            → council, success, integrate, shield
 *  - SDK "Copy Snippet" button (#copySdkCodeBtn)                         → copied (plays on click)
 * Loops pause off-screen and in background tabs; reduced-motion shows the resolved state.
 */
(function () {
  'use strict';

  var S = 'stroke="currentColor"';
  var R = 'stroke-linecap="round"';
  var J = 'stroke-linejoin="round"';
  var SHIELD = 'M20 5l12 4.5v9.5c0 7.5-5.2 12.6-12 15.5-6.8-2.9-12-8-12-15.5V9.5L20 5z';
  var CHECK_SHIELD = '<path class="si-draw si-check" pathLength="1" d="M14.5 19.5l4 4 7-8" ' + S + ' stroke-width="2.5" ' + R + ' ' + J + '/>';

  var ICONS = {
    success: {
      cls: 'si-success', duration: 2200,
      svg: '<circle class="si-ring" pathLength="1" cx="20" cy="20" r="16" ' + S + ' stroke-width="2"/>' +
           '<circle class="si-spin" pathLength="100" cx="20" cy="20" r="16" ' + S + ' stroke-width="2" ' + R + ' stroke-dasharray="25 75"/>' +
           '<path class="si-draw si-check" pathLength="1" d="M12 20l6 6 10-12" ' + S + ' stroke-width="2.5" ' + R + ' ' + J + '/>'
    },
    copied: {
      cls: 'si-copied', duration: 2200,
      svg: '<rect x="12" y="10" width="18" height="22" rx="2" ' + S + ' stroke-width="2"/>' +
           '<path d="M10 14h-0a2 2 0 00-2 2v18a2 2 0 002 2h14" ' + S + ' stroke-width="2" ' + R + ' opacity="0.3"/>' +
           '<g class="si-lines">' +
             '<line x1="17" y1="18" x2="25" y2="18" ' + S + ' stroke-width="2" ' + R + ' opacity="0.4"/>' +
             '<line x1="17" y1="23" x2="25" y2="23" ' + S + ' stroke-width="2" ' + R + ' opacity="0.4"/>' +
             '<line x1="17" y1="28" x2="22" y2="28" ' + S + ' stroke-width="2" ' + R + ' opacity="0.4"/>' +
           '</g>' +
           '<path class="si-draw si-check" pathLength="1" d="M16 21l4 4 6-8" ' + S + ' stroke-width="2.5" ' + R + ' ' + J + '/>'
    },
    docmind: {
      cls: 'si-doc', duration: 2600,
      svg: '<path d="M12 6h12l6 6v20a2 2 0 01-2 2H12a2 2 0 01-2-2V8a2 2 0 012-2z" ' + S + ' stroke-width="2" ' + J + '/>' +
           '<path d="M24 6v6h6" ' + S + ' stroke-width="2" ' + J + '/>' +
           '<g class="si-fields">' +
             '<line x1="14" y1="17" x2="26" y2="17" ' + S + ' stroke-width="2" ' + R + '/>' +
             '<line x1="14" y1="22" x2="26" y2="22" ' + S + ' stroke-width="2" ' + R + '/>' +
             '<line x1="14" y1="27" x2="22" y2="27" ' + S + ' stroke-width="2" ' + R + '/>' +
           '</g>' +
           '<line class="si-scan" x1="11" y1="10" x2="29" y2="10" ' + S + ' stroke-width="2" ' + R + '/>' +
           '<path class="si-draw si-check" pathLength="1" d="M14 21l4 4 8-9" ' + S + ' stroke-width="2.5" ' + R + ' ' + J + '/>'
    },
    voiceforge: {
      cls: 'si-voice', duration: 2400,
      svg: [8.5, 14, 19.5, 25, 30.5].map(function (x, i) {
        return '<rect class="si-bar" style="--i:' + i + '" x="' + x + '" y="8" width="3" height="24" rx="1.5" fill="currentColor"/>';
      }).join('')
    },
    complianceai: {
      cls: 'si-shield', duration: 2600,
      svg: '<path class="si-outline" pathLength="1" d="' + SHIELD + '" ' + S + ' stroke-width="2" ' + J + '/>' + CHECK_SHIELD
    },
    predictflow: {
      cls: 'si-forecast', duration: 2400,
      svg: '<path d="M8 7v25h25" ' + S + ' stroke-width="2" ' + R + ' ' + J + ' opacity="0.45"/>' +
           '<path class="si-trend" pathLength="1" d="M11 27l6-6 5 4 9-11" ' + S + ' stroke-width="2.5" ' + R + ' ' + J + '/>' +
           '<circle class="si-target" cx="31" cy="14" r="3" fill="currentColor"/>'
    },
    guardnet: {
      cls: 'si-guard', duration: 2400,
      svg: '<path class="si-outline" d="' + SHIELD + '" ' + S + ' stroke-width="2" ' + J + '/>' +
           '<circle class="si-threat" cx="7" cy="19" r="2.75" fill="#EF4444"/>' + CHECK_SHIELD
    },
    council: {
      cls: 'si-council', duration: 2600,
      svg: (function () {
        var nodes = [[20, 8], [31.4, 16.3], [27.1, 29.7], [12.9, 29.7], [8.6, 16.3]];
        var links = nodes.map(function (n, i) {
          return '<path class="si-link" style="--i:' + i + '" pathLength="1" d="M20 20L' + n[0] + ' ' + n[1] + '" ' + S + ' stroke-width="1.75" ' + R + '/>';
        }).join('');
        var dots = nodes.map(function (n, i) {
          return '<circle class="si-node" style="--i:' + i + ';--o:' + n[0] + 'px ' + n[1] + 'px" cx="' + n[0] + '" cy="' + n[1] + '" r="3" fill="currentColor"/>';
        }).join('');
        return links + dots + '<circle class="si-core" cx="20" cy="20" r="4" ' + S + ' stroke-width="2"/>';
      })()
    },
    integrate: {
      cls: 'si-integrate', duration: 2200,
      svg: '<rect class="si-left" x="5" y="13" width="11" height="14" rx="3" ' + S + ' stroke-width="2"/>' +
           '<rect class="si-right" x="24" y="13" width="11" height="14" rx="3" ' + S + ' stroke-width="2"/>' +
           '<path class="si-draw si-link-line" pathLength="1" d="M16 20h8" ' + S + ' stroke-width="2.5" ' + R + '/>' +
           '<circle class="si-spark" cx="20" cy="20" r="2" fill="currentColor"/>'
    }
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loops = [];            // { el, duration, last, visible }
  var io = null;

  function build(el) {
    if (el.__siBuilt) return;
    var key = el.getAttribute('data-si');
    var def = ICONS[key];
    if (!def) return;
    el.__siBuilt = true;
    el.classList.add('si', def.cls);
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">' + def.svg + '</svg>';

    if (el.getAttribute('data-si-mode') === 'manual') {
      el.setAttribute('data-on', '0');
      return;
    }
    if (reduceMotion) {
      el.setAttribute('data-on', '1');
      return;
    }
    el.setAttribute('data-on', '0');
    var duration = Number(el.getAttribute('data-si-duration')) || def.duration;
    var entry = { el: el, duration: duration, last: performance.now() + (Number(el.getAttribute('data-si-offset')) || 0), visible: !io };
    loops.push(entry);
    if (io) io.observe(el);
  }

  function tick(now) {
    if (!document.hidden) {
      for (var i = 0; i < loops.length; i++) {
        var l = loops[i];
        if (!l.visible || !l.el.isConnected) continue;
        if (now - l.last >= l.duration) {
          l.last = now;
          l.el.setAttribute('data-on', l.el.getAttribute('data-on') === '1' ? '0' : '1');
        }
      }
    }
    requestAnimationFrame(tick);
  }

  function mount(host, key, opts) {
    if (!host || host.querySelector(':scope > .si')) return null;
    var span = document.createElement('span');
    span.setAttribute('data-si', key);
    if (opts && opts.mode) span.setAttribute('data-si-mode', opts.mode);
    if (opts && opts.offset) span.setAttribute('data-si-offset', String(opts.offset));
    if (opts && opts.prepend) {
      host.insertBefore(span, host.firstChild);
    } else {
      host.innerHTML = '';
      host.appendChild(span);
    }
    build(span);
    return span;
  }

  function flash(el, ms) {
    if (!el) return;
    el.setAttribute('data-on', '1');
    clearTimeout(el.__siTimer);
    el.__siTimer = setTimeout(function () { el.setAttribute('data-on', '0'); }, ms || 1600);
  }

  var STAT_ICONS = ['council', 'success', 'integrate', 'complianceai'];

  function scan() {
    // Product + project cards
    document.querySelectorAll('.pc-card').forEach(function (card, i) {
      var slug = card.getAttribute('data-slug') || card.getAttribute('data-pc-project');
      if (!ICONS[slug] || ['docmind', 'voiceforge', 'complianceai', 'predictflow', 'guardnet'].indexOf(slug) === -1) return;
      var tile = card.querySelector('.pc-icon');
      if (tile) mount(tile, slug, { offset: (i % 5) * 260 });
    });

    // Product Suite stat bento
    document.querySelectorAll('.ps-stats-bento').forEach(function (bento) {
      bento.querySelectorAll('.ps-stat-card .ps-stat-icon').forEach(function (tile, i) {
        if (STAT_ICONS[i]) mount(tile, STAT_ICONS[i], { offset: i * 300 });
      });
    });

    // SDK copy button — plays the copied state on click
    var copyBtn = document.getElementById('copySdkCodeBtn');
    if (copyBtn && !copyBtn.__siBound) {
      copyBtn.__siBound = true;
      var icon = mount(copyBtn, 'copied', { mode: 'manual', prepend: true });
      copyBtn.addEventListener('click', function () { flash(icon, 1600); });
    }

    // Any author-placed <span data-si="...">
    document.querySelectorAll('[data-si]').forEach(build);
  }

  function init() {
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          for (var i = 0; i < loops.length; i++) {
            if (loops[i].el === e.target) loops[i].visible = e.isIntersecting;
          }
        });
      }, { rootMargin: '80px' });
    }
    scan();
    requestAnimationFrame(tick);

    // Re-scan when the multi-page router swaps views
    if ('MutationObserver' in window) {
      new MutationObserver(function () { requestAnimationFrame(scan); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-active-page'] });
    }
  }

  window.MicroSISStateIcons = { refresh: scan, mount: mount, flash: flash, icons: ICONS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
