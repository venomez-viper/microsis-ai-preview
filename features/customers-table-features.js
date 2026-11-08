/**
 * MicroSIS.ai — CustomersTableCard & ToggleGroup Filter Runtime (shadcn/features.tsx)
 *
 * Implements interactive status filtering (All | Paid | Ref | Cancelled) on CustomersTableCard
 * using Radix ToggleGroup semantics (data-state="on"|"off", aria-checked) and updates
 * the visible row count ("Showing X rows") dynamically.
 */
(function () {
  'use strict';

  function filterCustomersTable(cardEl, filterStatus) {
    if (!cardEl) return;
    var rows = cardEl.querySelectorAll('tbody tr[data-customer-status]');
    var visibleCount = 0;

    rows.forEach(function (row) {
      var rowStatus = row.getAttribute('data-customer-status') || '';
      var show = !filterStatus || filterStatus === 'all' || rowStatus === filterStatus;
      row.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    var countStrong = cardEl.querySelector('.ctf-row-count');
    var countWord = cardEl.querySelector('.ctf-row-word');
    if (countStrong) countStrong.textContent = String(visibleCount);
    if (countWord) countWord.textContent = visibleCount === 1 ? 'row' : 'rows';
  }

  function initCustomersTableFeatures() {
    document.addEventListener('click', function (e) {
      var toggleBtn = e.target.closest('.ctf-toggle-item[data-filter-status]');
      if (!toggleBtn) return;

      var group = toggleBtn.closest('.ctf-toggle-group');
      var card = toggleBtn.closest('.ctf-table-card');
      if (!group || !card) return;

      e.preventDefault();
      var targetStatus = toggleBtn.getAttribute('data-filter-status') || 'all';

      group.querySelectorAll('.ctf-toggle-item').forEach(function (item) {
        var isMatch = item === toggleBtn;
        item.setAttribute('data-state', isMatch ? 'on' : 'off');
        item.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      filterCustomersTable(card, targetStatus);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomersTableFeatures);
  } else {
    initCustomersTableFeatures();
  }
})();
