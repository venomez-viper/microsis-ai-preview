(function () {
  'use strict';

  var PAGES = [
    {
      slug: 'overview',
      path: '/',
      file: '/index.html',
      navLabel: 'Home',
      title: 'Overview & AI Product Suite',
      desc: 'Interactive Liquid Sculpture Stage, 5 Enterprise AI Products & Solution Finder',
      sections: [
        { id: 'home', label: 'Interactive Stage' },
        { id: 'home-products', label: '5 AI Products' },
        { id: 'finder', label: 'Solution Finder' }
      ]
    },
    {
      slug: 'capabilities',
      path: '/capabilities',
      file: '/capabilities.html',
      aliases: ['/products', '/products.html'],
      navLabel: 'Products',
      title: 'All 5 AI Products, Specs & ROI Estimator',
      desc: 'DocMind, VoiceForge, ComplianceAI, PredictFlow, GuardNet & TCO Modeler',
      sections: [
        { id: 'products', label: '5 AI Products & Matrix' },
        { id: 'roi', label: 'Impact & TCO Estimator' }
      ]
    },
    {
      slug: 'docmind',
      path: '/docmind',
      file: '/docmind.html',
      aliases: ['/products/docmind'],
      navLabel: 'DocMind',
      parentNav: 'capabilities',
      title: 'MicroSIS DocMind: AI Document Intelligence',
      desc: '8 Core Features, 4 Industry Use Cases & 3-Tier Licensing ($49 / $199 / $799)',
      sections: [
        { id: 'product-docmind', label: 'DocMind Overview' },
        { id: 'product-docmind-features', label: '8 Features' },
        { id: 'product-docmind-usecases', label: '4 Use Cases' },
        { id: 'pricing-docmind', label: 'Pricing & Free Trial' }
      ]
    },
    {
      slug: 'voiceforge',
      path: '/voiceforge',
      file: '/voiceforge.html',
      aliases: ['/products/voiceforge'],
      navLabel: 'VoiceForge',
      parentNav: 'capabilities',
      title: 'MicroSIS VoiceForge: AI Voice & Speech Platform',
      desc: '8 Core Features, 4 Industry Use Cases & 3-Tier Licensing ($20 / $149 / $599)',
      sections: [
        { id: 'product-voiceforge', label: 'VoiceForge Overview' },
        { id: 'product-voiceforge-features', label: '8 Features' },
        { id: 'product-voiceforge-usecases', label: '4 Use Cases' },
        { id: 'pricing-voiceforge', label: 'Pricing & Free Trial' }
      ]
    },
    {
      slug: 'complianceai',
      path: '/complianceai',
      file: '/complianceai.html',
      aliases: ['/products/complianceai'],
      navLabel: 'ComplianceAI',
      parentNav: 'capabilities',
      title: 'MicroSIS ComplianceAI (Regulatory Compliance) Automation',
      desc: '8 Core Features, 4 Industry Use Cases & 3-Tier Licensing ($299 / $799 / $2,499)',
      sections: [
        { id: 'product-complianceai', label: 'ComplianceAI Overview' },
        { id: 'product-complianceai-features', label: '8 Features' },
        { id: 'product-complianceai-usecases', label: '4 Use Cases' },
        { id: 'pricing-complianceai', label: 'Pricing & Free Trial' }
      ]
    },
    {
      slug: 'predictflow',
      path: '/predictflow',
      file: '/predictflow.html',
      aliases: ['/products/predictflow'],
      navLabel: 'PredictFlow',
      parentNav: 'capabilities',
      title: 'MicroSIS PredictFlow (Predictive Analytics) Engine',
      desc: '8 Core Features, 4 Industry Use Cases & 3-Tier Licensing ($99 / $399 / $1,299)',
      sections: [
        { id: 'product-predictflow', label: 'PredictFlow Overview' },
        { id: 'product-predictflow-features', label: '8 Features' },
        { id: 'product-predictflow-usecases', label: '4 Use Cases' },
        { id: 'pricing-predictflow', label: 'Pricing & Free Trial' }
      ]
    },
    {
      slug: 'guardnet',
      path: '/guardnet',
      file: '/guardnet.html',
      aliases: ['/products/guardnet'],
      navLabel: 'GuardNet',
      parentNav: 'capabilities',
      title: 'MicroSIS GuardNet (AI Cybersecurity) Shield',
      desc: '8 Core Features, 4 Industry Use Cases & 3-Tier Licensing ($69 / $349 / $999)',
      sections: [
        { id: 'product-guardnet', label: 'GuardNet Overview' },
        { id: 'product-guardnet-features', label: '8 Features' },
        { id: 'product-guardnet-usecases', label: '4 Use Cases' },
        { id: 'pricing-guardnet', label: 'Pricing & Free Trial' }
      ]
    },
    {
      slug: 'projects',
      path: '/projects',
      file: '/projects.html',
      navLabel: 'Projects',
      title: 'Selected Work & Institutional Outcomes',
      desc: 'Five Traceable Production Deployments & Verified Audit Benchmarks',
      sections: [
        { id: 'projects', label: 'Selected Work' },
        { id: 'customers', label: 'Verified Outcomes' }
      ]
    },
    {
      slug: 'workbench',
      path: '/workbench',
      file: '/workbench.html',
      navLabel: 'X\u2011Ray & Lab',
      title: 'Coordinate X\u2011Ray & Interactive Workbench',
      desc: 'Side-by-Side SHA-256 Provenance Inspector & Live OpenClaw Sandbox',
      sections: [
        { id: 'xray', label: 'Coordinate X\u2011Ray' },
        { id: 'playground', label: 'Interactive Workbench' }
      ]
    },
    {
      slug: 'architecture',
      path: '/architecture',
      file: '/architecture.html',
      navLabel: 'Architecture',
      title: 'OpenClaw Agent Council & Developer SDKs',
      desc: '7-Node Multi-Agent Consensus Topology, Live Trace & SDK Snippets',
      sections: [
        { id: 'architecture', label: '7-Node Agent Council' },
        { id: 'integration', label: 'Developer SDKs' }
      ]
    },
    {
      slug: 'security',
      path: '/security',
      file: '/security.html',
      navLabel: 'Security',
      title: 'Sovereign Security, Dossier Vault & Brand Architecture',
      desc: 'Air-Gapped Enclaves, 3D Glass Folder Evidence Vault & Liquid Glass Mark',
      sections: [
        { id: 'security', label: 'Enclaves & Evidence Vault' },
        { id: 'brand-reveal', label: 'Optical Brand Architecture' }
      ]
    },
    {
      slug: 'about',
      path: '/about',
      file: '/about.html',
      navLabel: 'About',
      title: 'About MicroSIS LLC: Built by Engineers Who Have Been There',
      desc: 'Company Story, 4 Core Values, 10B+ API Calls Processed, Engineering Principles & FAQ',
      sections: [
        { id: 'about', label: 'About MicroSIS & Values' },
        { id: 'faqList', label: 'Procurement & Security FAQ' }
      ]
    },
    {
      slug: 'demo',
      path: '/demo',
      file: '/demo.html',
      navLabel: 'Book a Demo',
      title: 'Book a Personalized Demo & Technical Briefing',
      desc: 'See MicroSIS.ai in Action. Schedule a 30-Minute Session or Provision a 14-Day Trial',
      sections: [
        { id: 'demo', label: 'Book a Demo' }
      ]
    },
    {
      slug: 'contact',
      path: '/contact',
      file: '/contact.html',
      navLabel: 'Contact',
      title: 'Contact MicroSIS.ai: Let\u2019s Talk',
      desc: 'Austin, TX Headquarters, Direct Phone, Email, Live Chat & Inquiry Form',
      sections: [
        { id: 'contact', label: 'Contact Info & Message Form' }
      ]
    },
    {
      slug: 'privacy',
      path: '/privacy',
      file: '/privacy.html',
      aliases: ['/privacy-policy', '/privacy-policy.html'],
      navLabel: 'Privacy Policy',
      parentNav: 'security',
      title: 'Enterprise Privacy Policy & Zero-Retention Covenant',
      desc: 'GDPR, CCPA/CPRA, HIPAA Data Protection, Zero Model Training & Sovereign Enclaves',
      sections: [
        { id: 'privacy', label: 'Privacy Policy' }
      ]
    },
    {
      slug: 'terms',
      path: '/terms',
      file: '/terms.html',
      aliases: ['/terms-of-service', '/msa', '/msa.html'],
      navLabel: 'Terms of Service (MSA)',
      parentNav: 'security',
      title: 'Enterprise Terms of Service & Master Subscription Agreement',
      desc: '100% Customer Output Ownership, AI IP Indemnification, Licensing & Governance',
      sections: [
        { id: 'terms', label: 'Terms & MSA' }
      ]
    },
    {
      slug: 'dpa',
      path: '/dpa',
      file: '/dpa.html',
      aliases: ['/baa', '/baa.html'],
      navLabel: 'DPA & HIPAA BAA',
      parentNav: 'security',
      title: 'Data Processing Addendum (DPA) & HIPAA Business Associate Agreement',
      desc: 'GDPR Art. 28 Processor Terms, 45 CFR HIPAA BAA, Technical Safeguards & Subprocessors',
      sections: [
        { id: 'dpa', label: 'DPA & HIPAA BAA' }
      ]
    },
    {
      slug: 'aup',
      path: '/aup',
      file: '/aup.html',
      aliases: ['/ai-policy', '/ai-policy.html'],
      navLabel: 'Acceptable Use & AI Policy',
      parentNav: 'security',
      title: 'Acceptable Use & Responsible AI Governance Policy',
      desc: 'ISO/IEC 42001 & EU AI Act Alignment, Voice Cloning Consent & Red-Teaming Safe Harbor',
      sections: [
        { id: 'aup', label: 'Acceptable Use & AI Governance' }
      ]
    },
    {
      slug: 'sla',
      path: '/sla',
      file: '/sla.html',
      aliases: ['/trust', '/trust.html'],
      navLabel: 'Enterprise SLA & Trust',
      parentNav: 'security',
      title: 'Enterprise Service Level Agreement (99.99% SLA) & Support Policy',
      desc: '99.99% Uptime Guarantee, P1 <15m Response SLA, Service Credits & Security Disclosure',
      sections: [
        { id: 'sla', label: 'SLA & Support Policy' }
      ]
    }
  ];

  var PAGE_BY_SLUG = {};
  var PAGE_BY_PATH = {};
  PAGES.forEach(function (p, i) {
    p.index = i;
    PAGE_BY_SLUG[p.slug] = p;
    PAGE_BY_PATH[p.path] = p.slug;
    PAGE_BY_PATH[p.file] = p.slug;
    if (p.aliases) {
      p.aliases.forEach(function (al) {
        PAGE_BY_PATH[al] = p.slug;
      });
    }
  });

  var HASH_TO_PAGE = {
    home: 'overview',
    'home-products': 'overview',
    sculptureHero: 'overview',
    finder: 'overview',
    products: 'capabilities',
    productDetails: 'capabilities',
    roi: 'capabilities',
    'product-docmind': 'docmind',
    'product-docmind-features': 'docmind',
    'product-docmind-usecases': 'docmind',
    'product-docmind-pricing': 'docmind',
    'pricing-docmind': 'docmind',
    'product-voiceforge': 'voiceforge',
    'product-voiceforge-features': 'voiceforge',
    'product-voiceforge-usecases': 'voiceforge',
    'product-voiceforge-pricing': 'voiceforge',
    'pricing-voiceforge': 'voiceforge',
    'product-complianceai': 'complianceai',
    'product-complianceai-features': 'complianceai',
    'product-complianceai-usecases': 'complianceai',
    'product-complianceai-pricing': 'complianceai',
    'pricing-complianceai': 'complianceai',
    'product-predictflow': 'predictflow',
    'product-predictflow-features': 'predictflow',
    'product-predictflow-usecases': 'predictflow',
    'product-predictflow-pricing': 'predictflow',
    'pricing-predictflow': 'predictflow',
    'product-guardnet': 'guardnet',
    'product-guardnet-features': 'guardnet',
    'product-guardnet-usecases': 'guardnet',
    'product-guardnet-pricing': 'guardnet',
    'pricing-guardnet': 'guardnet',
    projects: 'projects',
    customers: 'projects',
    xray: 'workbench',
    playground: 'workbench',
    architecture: 'architecture',
    integration: 'architecture',
    security: 'security',
    vault: 'security',
    glassFolderMount: 'security',
    'brand-reveal': 'security',
    about: 'about',
    faq: 'about',
    faqList: 'about',
    demo: 'demo',
    contact: 'contact',
    privacy: 'privacy',
    terms: 'terms',
    dpa: 'dpa',
    aup: 'aup',
    sla: 'sla'
  };

  function resolveInitialPage() {
    var pathname = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    var hash = (window.location.hash || '').replace(/^#/, '');

    if (hash) {
      if (HASH_TO_PAGE[hash]) return HASH_TO_PAGE[hash];
      if (hash.indexOf('product-') === 0) {
        var slugGuess = hash.replace(/^product-/, '').replace(/-pricing$/, '');
        if (PAGE_BY_SLUG[slugGuess]) return slugGuess;
      }
    }
    if (PAGE_BY_PATH[pathname]) {
      return PAGE_BY_PATH[pathname];
    }
    var bodyPage = document.body && document.body.getAttribute('data-page');
    if (bodyPage && PAGE_BY_SLUG[bodyPage]) {
      return bodyPage;
    }
    var preset = document.documentElement.getAttribute('data-active-page');
    if (preset && PAGE_BY_SLUG[preset]) {
      return preset;
    }
    return 'overview';
  }

  function revealVisibleFadeUps() {
    var active = document.documentElement.getAttribute('data-active-page') || 'overview';
    var secs = document.querySelectorAll('main > [data-page="' + active + '"]');
    secs.forEach(function (sec) {
      sec.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
    });
  }

  function syncNavbarAndDock(pageSlug) {
    var page = PAGE_BY_SLUG[pageSlug] || PAGES[0];
    var navSlug = page.parentNav || page.slug;
    var nav = document.getElementById('nimbusHeaderNav');
    if (nav) {
      var items = nav.querySelectorAll('.nimbus-item');
      items.forEach(function (it) {
        var itemSlug = it.getAttribute('data-page-link');
        if (itemSlug === navSlug || itemSlug === pageSlug) {
          it.setAttribute('aria-current', 'page');
        } else {
          it.removeAttribute('aria-current');
        }
      });
    }

    document.querySelectorAll('.mp-ribbon-pill').forEach(function (pill) {
      var pSlug = pill.getAttribute('data-page-link');
      pill.classList.toggle('active', pSlug === pageSlug);
    });

    var dock = document.getElementById('wayfindingDock');
    if (dock) {
      dock.querySelectorAll('.wf-pill').forEach(function (pill) {
        var pSlug = pill.getAttribute('data-page-link');
        pill.classList.toggle('active', pSlug === pageSlug || pSlug === navSlug);
      });
    }
  }

  function renderChrome(pageSlug) {
    var page = PAGE_BY_SLUG[pageSlug] || PAGES[0];
    var bcTitle = document.getElementById('mpBreadcrumbCurrent');
    var subnav = document.getElementById('mpSubnav');
    if (bcTitle) bcTitle.textContent = page.title;
    if (subnav) {
      subnav.innerHTML = page.sections
        .map(function (s) {
          return (
            '<a href="#' +
            s.id +
            '" class="mp-subpill" data-sub-jump="' +
            s.id +
            '">' +
            s.label +
            '</a>'
          );
        })
        .join('');
    }

    var prevIdx = (page.index - 1 + PAGES.length) % PAGES.length;
    var nextIdx = (page.index + 1) % PAGES.length;
    var prevPage = PAGES[prevIdx];
    var nextPage = PAGES[nextIdx];

    var prevCard = document.getElementById('mpPrevCard');
    var nextCard = document.getElementById('mpNextCard');
    if (prevCard) {
      prevCard.setAttribute('href', prevPage.file);
      prevCard.setAttribute('data-page-link', prevPage.slug);
      var pt = prevCard.querySelector('.mp-pager-title');
      var pd = prevCard.querySelector('.mp-pager-desc');
      if (pt) pt.textContent = '\u2190 ' + prevPage.navLabel;
      if (pd) pd.textContent = prevPage.desc;
    }
    if (nextCard) {
      nextCard.setAttribute('href', nextPage.file);
      nextCard.setAttribute('data-page-link', nextPage.slug);
      var nt = nextCard.querySelector('.mp-pager-title');
      var nd = nextCard.querySelector('.mp-pager-desc');
      if (nt) nt.textContent = nextPage.navLabel + ' \u2192';
      if (nd) nd.textContent = nextPage.desc;
    }

    var dirPills = document.getElementById('mpDirectoryPills');
    if (dirPills) {
      dirPills.querySelectorAll('.mp-dir-pill').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('data-page-link') === pageSlug);
      });
    }

    var badge = document.getElementById('mpActivePageBadge');
    if (badge) {
      var num = String(page.index + 1).padStart(2, '0');
      badge.textContent = 'Page ' + num + ' / ' + PAGES.length + ' · ' + page.navLabel;
    }

    var prevBtn = document.getElementById('mpPrevPageBtn');
    var nextBtn = document.getElementById('mpNextPageBtn');
    if (prevBtn) {
      prevBtn.setAttribute('href', prevPage.file);
      prevBtn.setAttribute('data-page-link', prevPage.slug);
      prevBtn.textContent = '\u2190 Previous: ' + prevPage.navLabel;
    }
    if (nextBtn) {
      nextBtn.setAttribute('href', nextPage.file);
      nextBtn.setAttribute('data-page-link', nextPage.slug);
      nextBtn.textContent = 'Next: ' + nextPage.navLabel + ' \u2192';
    }

    document.querySelectorAll('.mp-page-pill').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-page-link') === pageSlug);
      a.classList.toggle('active', a.getAttribute('data-page-link') === pageSlug);
    });
  }

  function switchPage(pageSlug, opts) {
    opts = opts || {};
    var page = PAGE_BY_SLUG[pageSlug] || PAGES[0];
    var prevSlug = document.documentElement.getAttribute('data-active-page');
    document.documentElement.setAttribute('data-active-page', page.slug);
    if (document.body) {
      document.body.setAttribute('data-page', page.slug);
    }
    var mobileToggle = document.getElementById('mobileToggle');
    var navLinks = document.getElementById('navLinks');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (navLinks) {
      navLinks.classList.remove('open');
    }

    // Hard DOM-level page isolation: hide all non-active page sections and unhide only the active page
    document.querySelectorAll('main > [data-page], section[data-page]').forEach(function (sec) {
      var secPage = sec.getAttribute('data-page');
      var isMatch = secPage === page.slug;
      sec.hidden = !isMatch;
      if (isMatch) {
        sec.removeAttribute('hidden');
        sec.style.display = 'block';
      } else {
        sec.setAttribute('hidden', 'hidden');
        sec.style.display = 'none';
      }
    });

    document.title =
      page.slug === 'overview'
        ? 'MicroSIS.ai | Applied Intelligence for Enterprise Scale'
        : page.title + ' \u00b7 MicroSIS.ai';

    renderChrome(page.slug);
    syncNavbarAndDock(page.slug);
    revealVisibleFadeUps();

    if (opts.pushState && window.location.protocol.indexOf('http') === 0) {
      var targetUrl = page.path + (opts.hash ? '#' + opts.hash : '');
      if (window.location.pathname + window.location.hash !== targetUrl) {
        try {
          window.history.pushState({ page: page.slug, hash: opts.hash || '' }, '', targetUrl);
        } catch (e) {}
      }
    }

    requestAnimationFrame(function () {
      window.dispatchEvent(new Event('resize'));
      if (window.MicroSISSculptureHero && typeof window.MicroSISSculptureHero.relayout === 'function') {
        window.MicroSISSculptureHero.relayout();
      }
    });

    if (opts.scrollTargetId) {
      var targetEl = document.getElementById(opts.scrollTargetId);
      if (targetEl) {
        requestAnimationFrame(function () {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }
    }

    if (prevSlug !== page.slug && opts.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('page_view', page.slug, page.path);
    }
  }

  function initMultiPageRouter() {
    var initial = resolveInitialPage();
    var initHash = (window.location.hash || '').replace(/^#/, '');
    switchPage(initial, {
      pushState: false,
      scrollToTop: false,
      scrollTargetId: initHash && initHash !== initial ? initHash : ''
    });

    document.addEventListener(
      'click',
      function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        // 1. Check if a "Back to All Products" button was clicked
        var backBtn = e.target.closest('.back-to-products');
        if (backBtn) {
          e.preventDefault();
          e.stopPropagation();
          switchPage('capabilities', { pushState: true });
          return;
        }

        // 2. Check if a "Workbench" (.try-in-sandbox-btn) button on a product card was clicked
        var wbBtn = e.target.closest('.try-in-sandbox-btn');
        if (wbBtn) {
          e.preventDefault();
          e.stopPropagation();
          var wbSlug = wbBtn.getAttribute('data-slug') || 'docmind';
          switchPage('workbench', { pushState: true, scrollTargetId: 'playground' });
          setTimeout(function () {
            var tab = document.querySelector('.sandbox-ptab[data-slug="' + wbSlug + '"]');
            if (tab) tab.click();
          }, 60);
          return;
        }

        // 3. Check if a [data-product] link, .explore-product-btn, [data-product-row], or .product-card[data-slug] was clicked
        var prodLink = e.target.closest('[data-product], .explore-product-btn, [data-product-row]');
        if (prodLink && !e.target.closest('.start-order') && !e.target.closest('.pricing-toggle') && !e.target.closest('.toggle-switch')) {
          var pSlug =
            prodLink.getAttribute('data-product') ||
            prodLink.getAttribute('data-slug') ||
            prodLink.getAttribute('data-product-row');
          if (pSlug && PAGE_BY_SLUG[pSlug]) {
            e.preventDefault();
            e.stopPropagation();
            switchPage(pSlug, { pushState: true });
            return;
          }
        }

        var prodCard = e.target.closest('.product-card[data-slug]');
        if (prodCard && !e.target.closest('button') && !e.target.closest('a')) {
          var cardSlug = prodCard.getAttribute('data-slug');
          if (cardSlug && PAGE_BY_SLUG[cardSlug]) {
            e.preventDefault();
            e.stopPropagation();
            switchPage(cardSlug, { pushState: true });
            return;
          }
        }

        var a = e.target.closest('a[href]');
        if (!a) return;
        var rawHref = a.getAttribute('href') || '';
        if (!rawHref || rawHref.indexOf('mailto:') === 0 || rawHref.indexOf('tel:') === 0 || rawHref.indexOf('http') === 0 || rawHref === '/admin') {
          return;
        }

        // 4. Explicit data-page-link attribute
        var explicitPage = a.getAttribute('data-page-link');
        if (explicitPage && PAGE_BY_SLUG[explicitPage]) {
          e.preventDefault();
          var subHash = rawHref.indexOf('#') !== -1 ? rawHref.split('#')[1] : '';
          switchPage(explicitPage, {
            pushState: true,
            hash: subHash,
            scrollTargetId: subHash
          });
          return;
        }

        // 5. Path-based link (/docmind, /docmind.html, /about.html, etc.)
        var pathPart = rawHref.split('#')[0];
        var hashPart = rawHref.indexOf('#') !== -1 ? rawHref.split('#')[1] : '';
        if (pathPart && PAGE_BY_PATH[pathPart]) {
          e.preventDefault();
          switchPage(PAGE_BY_PATH[pathPart], {
            pushState: true,
            hash: hashPart,
            scrollTargetId: hashPart
          });
          return;
        }

        // 6. Hash-based link (#xray, #demo, #about, #product-docmind-pricing, etc.)
        if (rawHref.charAt(0) === '#' && rawHref.length > 1) {
          var targetId = rawHref.slice(1);
          var ownerPage = HASH_TO_PAGE[targetId];
          if (ownerPage) {
            var current = document.documentElement.getAttribute('data-active-page') || 'overview';
            if (ownerPage !== current) {
              e.preventDefault();
              switchPage(ownerPage, {
                pushState: true,
                hash: targetId,
                scrollTargetId: targetId
              });
            }
          }
        }
      },
      true
    );

    // Support Command Palette (⌘K) actions that jump to sections on other pages
    document.addEventListener(
      'click',
      function (e) {
        var cmdBtn = e.target.closest('.cmd-item[data-cmd]');
        if (!cmdBtn) return;
        var cmd = cmdBtn.getAttribute('data-cmd');
        var cmdPageMap = {
          'run-council': 'architecture',
          'redteam-workbench': 'workbench',
          'xray-loupe': 'workbench',
          'finder-jump': 'overview',
          'schedule-briefing': 'demo'
        };
        if (cmdPageMap[cmd]) {
          switchPage(cmdPageMap[cmd], { pushState: true, scrollToTop: false });
        }
      },
      true
    );

    window.addEventListener('popstate', function (e) {
      var pageSlug = (e.state && e.state.page) || resolveInitialPage();
      switchPage(pageSlug, { pushState: false });
    });
  }

  window.MicroSISMultiPage = {
    switchPage: switchPage,
    pages: PAGES
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMultiPageRouter);
  } else {
    initMultiPageRouter();
  }
})();
