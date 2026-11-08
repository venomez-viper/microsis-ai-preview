/**
 * MicroSIS.ai — Interactive ID Card Lanyard (Contact Us Page Side Badge)
 * Port of components/ui/id-card-lanyard.tsx
 */
(function () {
  'use strict';

  function initIDCardLanyard() {
    var root = document.getElementById('contactLanyardRoot');
    if (!root) return;

    // Load Google Fonts once
    var fontId = 'idcl-fonts';
    if (!document.getElementById(fontId)) {
      var link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Caveat:wght@600;700&display=swap';
      document.head.appendChild(link);
    }

    var scene = root.querySelector('.idcl-stage');
    var canvas = root.querySelector('.idcl-rope');
    var rail = root.querySelector('.idcl-rail');
    var card = root.querySelector('.idcl-card');
    var flipper = root.querySelector('.idcl-flipper');
    var barcodeEl = root.querySelector('.idcl-barcode');
    var qrBackEl = root.querySelector('.idcl-qr-back');
    var qrFrontEl = root.querySelector('.idcl-qr-front');
    var hintEl = root.querySelector('.idcl-hint');

    if (!scene || !canvas || !rail || !card || !flipper || !barcodeEl || !qrBackEl || !qrFrontEl) {
      return;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    barcodeEl.innerHTML = '';
    for (var i = 0; i < 30; i++) {
      var bar = document.createElement('span');
      bar.style.height = ((i * 37) % 100 > 40 ? 100 : 55) + '%';
      barcodeEl.appendChild(bar);
    }

    function buildQR(el, seed) {
      el.innerHTML = '';
      var N = 9;
      var seedOn = {
        0: 1, 1: 1, 2: 1, 9: 1, 10: 1, 11: 1, 18: 1, 19: 1, 20: 1,
        6: 1, 7: 1, 8: 1, 15: 1, 16: 1, 17: 1, 24: 1, 25: 1, 26: 1,
        54: 1, 55: 1, 56: 1, 63: 1, 64: 1, 65: 1, 72: 1, 73: 1, 74: 1
      };
      for (var k = 0; k < N * N; k++) {
        var cell = document.createElement('i');
        var pseudoRandom = (k * seed) % 97 < 46;
        if (seedOn[k] || pseudoRandom) cell.classList.add('on');
        el.appendChild(cell);
      }
    }

    buildQR(qrBackEl, 928371);
    buildQR(qrFrontEl, 574123);

    var anchorX = 'calc(100% - 170px)';
    var anchorY = 98;

    function resolveAnchorX() {
      var w = scene.clientWidth || window.innerWidth;
      var v = anchorX.trim();
      var calcMatch = v.match(/^calc\(\s*100%\s*-\s*([\d.]+)px\s*\)$/);
      if (calcMatch) return Math.max(120, w - parseFloat(calcMatch[1]));
      if (v.endsWith('%')) return w * (parseFloat(v) / 100);
      return parseFloat(v);
    }

    var anchor = { x: resolveAnchorX(), y: anchorY };

    var NUM_POINTS = 13;
    var REST_LENGTH = 135;
    var SEGMENT_LENGTH = REST_LENGTH / (NUM_POINTS - 1);
    var GRAVITY = 0.55;
    var FRICTION = 0.98;
    var CONSTRAINT_ITERATIONS = 6;
    var TAP_THRESHOLD = 6;
    var MAX_TILT = 9;

    var points = [];
    function resetPoints() {
      points = [];
      for (var pIdx = 0; pIdx < NUM_POINTS; pIdx++) {
        var y = anchor.y + pIdx * SEGMENT_LENGTH;
        points.push({
          x: anchor.x,
          y: y,
          oldx: anchor.x - (pIdx === NUM_POINTS - 1 ? 14 : 0),
          oldy: y,
          pinned: pIdx === 0
        });
      }
    }

    function resize() {
      var w = scene.clientWidth || window.innerWidth;
      var h = scene.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      anchor.x = resolveAnchorX();
      rail.style.left = anchor.x + 'px';
      rail.style.top = anchor.y - 3 + 'px';
    }

    resize();
    resetPoints();

    var dragging = false;
    var flipped = false;
    var downPos = { x: anchor.x, y: anchor.y };
    var pointer = { x: anchor.x, y: anchor.y + REST_LENGTH };
    var lastPointer = { x: pointer.x, y: pointer.y };
    var velocity = { x: 0, y: 0 };

    var flipTarget = 0;
    var flipCurrent = 0;
    var tiltTarget = { x: 0, y: 0 };
    var tiltCurrent = { x: 0, y: 0 };
    var mouse = { x: -9999, y: -9999 };

    function getScenePos(e) {
      var rect = scene.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function clampToScene(p) {
      var margin = 18;
      p.x = Math.max(margin, Math.min(canvas.width - margin, p.x));
      p.y = Math.max(anchor.y + 20, Math.min(canvas.height - 30, p.y));
      return p;
    }

    function updatePoints() {
      for (var idx = 1; idx < points.length; idx++) {
        if (dragging && idx === points.length - 1) continue;
        var p = points[idx];
        var vx = (p.x - p.oldx) * FRICTION;
        var vy = (p.y - p.oldy) * FRICTION;
        p.oldx = p.x;
        p.oldy = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }
    }

    function applyConstraints() {
      points[0].x = anchor.x;
      points[0].y = anchor.y;
      if (dragging) {
        var last = points[points.length - 1];
        last.x = pointer.x;
        last.y = pointer.y;
      }
      for (var iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (var idx = 0; idx < points.length - 1; idx++) {
          var p1 = points[idx];
          var p2 = points[idx + 1];
          var dx = p2.x - p1.x;
          var dy = p2.y - p1.y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          var diff = (SEGMENT_LENGTH - dist) / dist;
          var offX = dx * diff * 0.5;
          var offY = dy * diff * 0.5;
          var p1Locked = p1.pinned;
          var p2Locked = dragging && idx + 1 === points.length - 1;
          if (!p1Locked) {
            p1.x -= offX;
            p1.y -= offY;
          }
          if (!p2Locked) {
            p2.x += offX;
            p2.y += offY;
          }
        }
      }
      for (var cIdx = 1; cIdx < points.length; cIdx++) clampToScene(points[cIdx]);
    }

    function drawRope() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var path = [];
      path.push({ x: points[0].x, y: points[0].y });
      for (var idx = 1; idx < points.length - 1; idx++) {
        var midX = (points[idx].x + points[idx + 1].x) / 2;
        var midY = (points[idx].y + points[idx + 1].y) / 2;
        path.push({ x: points[idx].x, y: points[idx].y, cx: midX, cy: midY });
      }
      path.push({
        x: points[points.length - 1].x,
        y: points[points.length - 1].y
      });

      function strokeRibbon(style, width) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var j = 1; j < path.length; j++) {
          var pt = path[j];
          if (pt.cx !== undefined) {
            ctx.quadraticCurveTo(pt.x, pt.y, pt.cx, pt.cy);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = style;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(2, 4);
      ctx.globalAlpha = 0.3;
      strokeRibbon('#000000', 16);
      ctx.restore();

      strokeRibbon('#1c1e23', 16);
      strokeRibbon('rgba(0,0,0,0.35)', 16.5);
      strokeRibbon('#1c1e23', 13.5);
      strokeRibbon('rgba(255,255,255,0.07)', 3);

      var markIdx = Math.floor(points.length * 0.3);
      var m = points[markIdx];
      var mPrev = points[markIdx - 1];
      var mNext = points[markIdx + 1];
      var angle =
        Math.atan2(mNext.y - mPrev.y, mNext.x - mPrev.x) + Math.PI / 2;
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(angle);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, 3.5);
      ctx.lineTo(0, -3.5);
      ctx.lineTo(4, 3.5);
      ctx.stroke();
      ctx.restore();
    }

    function drawClip() {
      ctx.save();
      ctx.translate(anchor.x, anchor.y - 2);
      var g = ctx.createLinearGradient(-11, -9, 11, 9);
      g.addColorStop(0, '#e7e9ec');
      g.addColorStop(0.35, '#aeb2b8');
      g.addColorStop(0.65, '#7c8087');
      g.addColorStop(1, '#4d5157');
      ctx.fillStyle = g;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-11, -9, 22, 16, 4);
      } else {
        ctx.rect(-11, -9, 22, 16);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-8, -6);
      ctx.lineTo(8, -6);
      ctx.stroke();
      ctx.fillStyle = '#3a3d42';
      ctx.beginPath();
      ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function positionCard() {
      var last = points[points.length - 1];
      var prev = points[points.length - 2];
      var angle = Math.atan2(last.y - prev.y, last.x - prev.x) - Math.PI / 2;
      card.style.left = last.x - card.offsetWidth / 2 + 'px';
      card.style.top = last.y + 'px';
      card.style.transform = 'rotate(' + angle + 'rad)';
    }

    function updateTiltAndSheen() {
      flipCurrent += (flipTarget - flipCurrent) * 0.16;

      var hovering = !dragging && mouse.x > -1000;
      if (hovering && card.offsetWidth > 0) {
        var cx = card.offsetLeft + card.offsetWidth / 2;
        var cy = card.offsetTop + card.offsetHeight / 2;
        var dx = Math.max(
          -1,
          Math.min(1, (mouse.x - cx) / (card.offsetWidth / 2))
        );
        var dy = Math.max(
          -1,
          Math.min(1, (mouse.y - cy) / (card.offsetHeight / 2))
        );
        tiltTarget.y = dx * MAX_TILT;
        tiltTarget.x = -dy * MAX_TILT;

        var mx = Math.max(
          0,
          Math.min(100, ((mouse.x - card.offsetLeft) / card.offsetWidth) * 100)
        );
        var my = Math.max(
          0,
          Math.min(100, ((mouse.y - card.offsetTop) / card.offsetHeight) * 100)
        );
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
        card.classList.add('idcl-hovering');
      } else {
        tiltTarget.x = 0;
        tiltTarget.y = 0;
        card.classList.remove('idcl-hovering');
      }

      tiltCurrent.x += (tiltTarget.x - tiltCurrent.x) * 0.12;
      tiltCurrent.y += (tiltTarget.y - tiltCurrent.y) * 0.12;

      flipper.style.transform =
        'rotateY(' +
        (flipCurrent + tiltCurrent.y) +
        'deg) rotateX(' +
        tiltCurrent.x +
        'deg)';
    }

    function isContactPageActive() {
      return (
        document.documentElement.getAttribute('data-active-page') === 'contact'
      );
    }

    function loop() {
      if (isContactPageActive() && !document.hidden) {
        if (canvas.width === 0 || canvas.height === 0) {
          resize();
          resetPoints();
        }
        updatePoints();
        applyConstraints();
        drawRope();
        drawClip();
        positionCard();
        updateTiltAndSheen();
      }
      window.requestAnimationFrame(loop);
    }

    card.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a')) return;
      e.preventDefault();
      dragging = true;
      if (hintEl) hintEl.classList.add('idcl-hint-hidden');
      try {
        card.setPointerCapture(e.pointerId);
      } catch (err) {}
      var pos = clampToScene(getScenePos(e));
      pointer = pos;
      lastPointer = { x: pos.x, y: pos.y };
      downPos = { x: pos.x, y: pos.y };
    });

    window.addEventListener('pointermove', function (e) {
      if (!isContactPageActive()) return;
      mouse = getScenePos(e);
      if (!dragging) return;
      var pos = clampToScene({ x: mouse.x, y: mouse.y });
      velocity.x = pos.x - lastPointer.x;
      velocity.y = pos.y - lastPointer.y;
      lastPointer = { x: pos.x, y: pos.y };
      pointer = pos;
    });

    window.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      var pos = getScenePos(e);
      var dist = Math.hypot(pos.x - downPos.x, pos.y - downPos.y);
      if (dist < TAP_THRESHOLD) {
        flipped = !flipped;
        flipTarget = flipped ? 180 : 0;
        var last = points[points.length - 1];
        last.oldx = last.x;
        last.oldy = last.y;
        return;
      }
      var lastPt = points[points.length - 1];
      lastPt.oldx = lastPt.x - velocity.x;
      lastPt.oldy = lastPt.y - velocity.y;
    });

    window.addEventListener('resize', resize, { passive: true });

    var obs = new MutationObserver(function () {
      if (isContactPageActive()) {
        resize();
        resetPoints();
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-active-page']
    });

    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIDCardLanyard);
  } else {
    initIDCardLanyard();
  }
})();
