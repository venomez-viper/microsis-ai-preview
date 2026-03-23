/* ============================================
   MicroSIS.ai — Frontend Application
   ============================================ */

(function () {
  'use strict';

  // --------------- State ---------------
  let products = [];
  let billingCycle = 'monthly'; // 'monthly' or 'annual'
  let currentProduct = null;

  // --------------- DOM Refs ---------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // --------------- Init ---------------
  document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    renderProductCards();
    renderProductDetails();
    initScrollAnimations();
    initNavigation();
    initForms();
    initBackToTop();
    initFooterProductLinks();
  });

  // --------------- Load Products ---------------
  async function loadProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      products = data.products;
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }

  // --------------- Render Product Cards ---------------
  function renderProductCards() {
    const grid = $('#productsGrid');
    if (!grid || !products.length) return;

    grid.innerHTML = products.map((p, i) => `
      <div class="product-card fade-up fade-up-delay-${Math.min(i + 1, 4)}" style="--card-accent:${p.color}" data-slug="${p.slug}">
        <div class="product-icon" style="background:${p.color}15;color:${p.color}">${p.icon}</div>
        <h3 class="headline-sm">${p.name}</h3>
        <div class="product-tagline">${p.tagline}</div>
        <p class="body-md">${p.description.substring(0, 120)}...</p>
        <div class="product-targets">
          ${p.targets.map(t => `<span class="product-target">${t}</span>`).join('')}
        </div>
        <div class="price-from">From <strong>$${p.plans[0].price}</strong>/mo</div>
      </div>
    `).join('');

    // Click handlers
    $$('.product-card', grid).forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        showProductDetail(slug);
      });
    });

    // Re-observe new elements
    initScrollAnimations();
  }

  // --------------- Render Product Detail Sections ---------------
  function renderProductDetails() {
    const container = $('#productDetails');
    if (!container || !products.length) return;

    container.innerHTML = products.map(p => `
      <div class="product-detail" id="product-${p.slug}" data-slug="${p.slug}">
        <!-- Product Hero -->
        <div class="product-hero section" style="background:linear-gradient(180deg, ${p.color}08 0%, transparent 100%)">
          <div class="container text-center">
            <button class="btn btn-secondary btn-sm mb-32 back-to-products" style="margin:0 auto 32px">← All Products</button>
            <div class="product-icon-lg fade-up" style="background:${p.color}15;color:${p.color}">${p.icon}</div>
            <h1 class="headline-xl mb-16 fade-up fade-up-delay-1">${p.name}</h1>
            <p class="body-lg fade-up fade-up-delay-2" style="max-width:640px;margin:0 auto 40px">${p.description}</p>
            <div class="btn-group fade-up fade-up-delay-3" style="justify-content:center">
              <a href="#product-${p.slug}-pricing" class="btn btn-primary btn-lg">View Pricing</a>
              <a href="#demo" class="btn btn-secondary btn-lg">Book a Demo</a>
            </div>
          </div>
        </div>

        <!-- Features -->
        <section class="section section-gray">
          <div class="container">
            <div class="text-center mb-64">
              <span class="label fade-up">Features</span>
              <h2 class="headline-lg mb-16 fade-up fade-up-delay-1">Everything you need.<br>Nothing you don't.</h2>
            </div>
            <div class="features-grid">
              ${p.features.map((f, i) => `
                <div class="feature-item fade-up fade-up-delay-${Math.min((i % 4) + 1, 4)}">
                  <div class="feature-icon" style="background:${p.color}15;color:${p.color}">${getFeatureIcon(i)}</div>
                  <h4>${f.split(' — ')[0]}</h4>
                  <p>${f}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Use Cases -->
        <section class="section">
          <div class="container">
            <div class="text-center mb-64">
              <span class="label fade-up">Use Cases</span>
              <h2 class="headline-lg mb-16 fade-up fade-up-delay-1">Built for your industry.</h2>
              <p class="body-lg fade-up fade-up-delay-2" style="max-width:640px;margin:0 auto">See how leading organizations use ${p.name} to transform their workflows.</p>
            </div>
            <div class="use-cases-grid">
              ${p.useCases.map((uc, i) => `
                <div class="use-case-card fade-up fade-up-delay-${Math.min(i + 1, 4)}">
                  <h4>${uc.title}</h4>
                  <p>${uc.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Pricing -->
        <section class="section section-gray" id="product-${p.slug}-pricing">
          <div class="container">
            <div class="text-center mb-48">
              <span class="label fade-up">Pricing</span>
              <h2 class="headline-lg mb-16 fade-up fade-up-delay-1">Simple, transparent pricing.</h2>
              <p class="body-lg fade-up fade-up-delay-2" style="max-width:560px;margin:0 auto">Start small, scale as you grow. All plans include a 14-day free trial.</p>
            </div>
            <div class="pricing-toggle fade-up" data-product="${p.slug}">
              <span class="active" data-cycle="monthly">Monthly</span>
              <div class="toggle-switch" data-product="${p.slug}"></div>
              <span data-cycle="annual">Annual</span>
              <span class="save-badge">Save 20%</span>
            </div>
            <div class="pricing-grid" data-product="${p.slug}">
              ${p.plans.map((plan, i) => `
                <div class="pricing-card ${plan.popular ? 'popular' : ''} fade-up fade-up-delay-${i + 1}">
                  ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                  <h3>${plan.name}</h3>
                  <div class="pricing-amount">
                    <span class="pricing-currency">$</span>
                    <span class="pricing-value" data-monthly="${plan.price}" data-annual="${plan.annualPrice}">${plan.price}</span>
                  </div>
                  <div class="pricing-period">per month, billed <span class="billing-text">monthly</span></div>
                  <ul class="pricing-features">
                    ${plan.features.map(f => `<li>${f}</li>`).join('')}
                  </ul>
                  <button class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} start-order"
                    data-product="${p.slug}"
                    data-plan="${plan.name}"
                    data-price="${plan.price}"
                    data-annual-price="${plan.annualPrice}"
                    data-product-name="${p.name}">
                    Start Free Trial
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="section section-dark">
          <div class="container text-center">
            <h2 class="headline-lg mb-16 fade-up">Ready to get started?</h2>
            <p class="body-lg fade-up fade-up-delay-1" style="max-width:560px;margin:0 auto 40px">Join thousands of organizations already using ${p.name} to work smarter.</p>
            <div class="btn-group fade-up fade-up-delay-2" style="justify-content:center">
              <button class="btn btn-white btn-lg start-order" data-product="${p.slug}" data-plan="${p.plans[1].name}" data-price="${p.plans[1].price}" data-annual-price="${p.plans[1].annualPrice}" data-product-name="${p.name}">Start Free Trial</button>
              <a href="#demo" class="btn btn-secondary btn-lg" style="border-color:var(--white);color:var(--white)">Talk to Sales</a>
            </div>
          </div>
        </section>
      </div>
    `).join('');

    // Back buttons
    $$('.back-to-products').forEach(btn => {
      btn.addEventListener('click', () => hideProductDetail());
    });

    // Pricing toggles
    $$('.toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', () => handlePricingToggle(toggle));
    });

    // Order buttons
    $$('.start-order').forEach(btn => {
      btn.addEventListener('click', () => openCheckout(btn));
    });

    initScrollAnimations();
  }

  // --------------- Product Detail Navigation ---------------
  function showProductDetail(slug) {
    // Hide main sections
    $('#home').style.display = 'none';
    $('#products').style.display = 'none';
    $('#about').style.display = 'none';
    $('#demo').style.display = 'none';
    $('#contact').style.display = 'none';

    // Hide all product details, show selected
    $$('.product-detail').forEach(d => d.classList.remove('active'));
    const detail = $(`#product-${slug}`);
    if (detail) {
      detail.classList.add('active');
      currentProduct = slug;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initScrollAnimations();
    }
  }

  function hideProductDetail() {
    $$('.product-detail').forEach(d => d.classList.remove('active'));
    currentProduct = null;
    $('#home').style.display = '';
    $('#products').style.display = '';
    $('#about').style.display = '';
    $('#demo').style.display = '';
    $('#contact').style.display = '';
    const productsSection = $('#products');
    if (productsSection) {
      setTimeout(() => productsSection.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }

  // --------------- Pricing Toggle ---------------
  function handlePricingToggle(toggle) {
    const productSlug = toggle.dataset.product;
    const isAnnual = !toggle.classList.contains('active');

    toggle.classList.toggle('active');

    // Update labels
    const container = toggle.closest('.pricing-toggle');
    const labels = $$('span[data-cycle]', container);
    labels.forEach(l => l.classList.toggle('active'));

    // Update prices
    const pricingGrid = $(`.pricing-grid[data-product="${productSlug}"]`);
    $$('.pricing-value', pricingGrid).forEach(el => {
      const price = isAnnual ? el.dataset.annual : el.dataset.monthly;
      animateValue(el, parseInt(el.textContent), parseInt(price), 300);
    });

    // Update billing text
    $$('.billing-text', pricingGrid).forEach(el => {
      el.textContent = isAnnual ? 'annually' : 'monthly';
    });

    // Update order buttons
    $$('.start-order', pricingGrid).forEach(btn => {
      btn.dataset.billingCycle = isAnnual ? 'annual' : 'monthly';
    });

    billingCycle = isAnnual ? 'annual' : 'monthly';
  }

  function animateValue(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + range * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --------------- Checkout ---------------
  function openCheckout(btn) {
    const productSlug = btn.dataset.product;
    const plan = btn.dataset.plan;
    const price = billingCycle === 'annual' ? btn.dataset.annualPrice : btn.dataset.price;
    const productName = btn.dataset.productName;

    $('#checkoutProductSlug').value = productSlug;
    $('#checkoutPlan').value = plan;
    $('#checkoutBillingCycle').value = billingCycle;
    $('#checkoutSummary').textContent = `${productName} — ${plan} Plan · $${price}/mo billed ${billingCycle}`;
    $('#checkoutSubmitBtn').textContent = `Start Free Trial — $${price}/mo`;

    const modal = $('#checkoutModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    const modal = $('#checkoutModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --------------- Navigation ---------------
  function initNavigation() {
    // Scroll effect
    const nav = $('#nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Mobile toggle
    const toggle = $('#mobileToggle');
    const links = $('#navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
      });

      // Close on link click
      $$('a', links).forEach(a => {
        a.addEventListener('click', () => {
          toggle.classList.remove('active');
          links.classList.remove('open');
          // If viewing product detail, go back
          if (currentProduct && !a.getAttribute('href').startsWith('#product-')) {
            hideProductDetail();
          }
        });
      });
    }

    // Smooth scroll for hash links
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = $(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // If in product view, need to go back first
        if (currentProduct && !a.getAttribute('href').startsWith('#product-')) {
          hideProductDetail();
          setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    // Close checkout
    $('#checkoutClose').addEventListener('click', closeCheckout);
    $('#checkoutModal').addEventListener('click', e => {
      if (e.target === $('#checkoutModal')) closeCheckout();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeCheckout();
    });
  }

  // --------------- Scroll Animations ---------------
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.fade-up:not(.visible)').forEach(el => observer.observe(el));
  }

  // --------------- Forms ---------------
  function initForms() {
    // Demo form
    const demoForm = $('#demoForm');
    if (demoForm) {
      demoForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('button[type="submit"]', demoForm);
        await submitForm('/api/demo-request', new FormData(demoForm), btn);
        demoForm.reset();
      });
    }

    // Contact form
    const contactForm = $('#contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('button[type="submit"]', contactForm);
        await submitForm('/api/leads', new FormData(contactForm), btn);
        contactForm.reset();
      });
    }

    // Checkout form
    const checkoutForm = $('#checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('#checkoutSubmitBtn');
        const result = await submitForm('/api/orders', new FormData(checkoutForm), btn);
        if (result && result.success) {
          closeCheckout();
          checkoutForm.reset();
        }
      });
    }

    // Newsletter
    const newsletterBtn = $('#newsletterBtn');
    if (newsletterBtn) {
      newsletterBtn.addEventListener('click', async () => {
        const emailInput = $('#newsletterEmail');
        const email = emailInput.value.trim();
        if (!email || !email.includes('@')) {
          showToast('Please enter a valid email address.', 'error');
          return;
        }
        newsletterBtn.innerHTML = '<span class="spinner"></span>';
        try {
          const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message);
            emailInput.value = '';
          } else {
            showToast(data.error || 'Something went wrong.', 'error');
          }
        } catch {
          showToast('Network error. Please try again.', 'error');
        }
        newsletterBtn.textContent = 'Subscribe';
      });
    }
  }

  async function submitForm(url, formData, btn) {
    const originalText = btn.textContent;
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span> Processing...';

    const body = {};
    formData.forEach((val, key) => { body[key] = val; });

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        btn.textContent = '✓ Done!';
        setTimeout(() => { btn.textContent = originalText; btn.classList.remove('loading'); }, 2000);
        return data;
      } else {
        showToast(data.error || 'Something went wrong.', 'error');
        btn.textContent = originalText;
        btn.classList.remove('loading');
        return null;
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
      btn.textContent = originalText;
      btn.classList.remove('loading');
      return null;
    }
  }

  // --------------- Toast Notifications ---------------
  function showToast(message, type = 'success') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-message">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // --------------- Back to Top ---------------
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------- Footer Product Links ---------------
  function initFooterProductLinks() {
    $$('[data-product]').forEach(link => {
      if (link.closest('.footer')) {
        link.addEventListener('click', e => {
          e.preventDefault();
          showProductDetail(link.dataset.product);
        });
      }
    });
  }

  // --------------- Helpers ---------------
  function getFeatureIcon(index) {
    const icons = ['⚡', '🎯', '🔄', '🌐', '📈', '🛡️', '🔗', '📋'];
    return icons[index % icons.length];
  }

})();
