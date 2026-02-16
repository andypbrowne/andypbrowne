document.addEventListener('DOMContentLoaded', function() {
  const STORAGE_KEY = 'bookshelfFilters';

  // Open details on large screens, close on small screens
  const filterDetails = document.querySelector('.filtering-details');
  function syncDetailsWithScreenSize() {
    if (filterDetails) {
      if (window.innerWidth >= 676) {
        filterDetails.setAttribute('open', '');
      } else {
        filterDetails.removeAttribute('open');
      }
    }
  }
  syncDetailsWithScreenSize();
  window.addEventListener('resize', syncDetailsWithScreenSize);

  const filterRadios = Array.from(document.querySelectorAll('input[name="filter"]')); // tag radios
  const statusSelect = document.getElementById('status-select'); // the status dropdown
  const groupToggle = document.getElementById('group-by-years'); // new grouping checkbox
  const bookCards = Array.from(document.querySelectorAll('.book-card, .filter-grid-item'));
  const headers = document.querySelectorAll('.bookshelf-header');
  const bookLists = document.querySelectorAll('ol.bookshelf.filter-grid');

  // track current selections (persist status across tag changes)
  let currentStatus = (statusSelect && statusSelect.value) ? statusSelect.value.toLowerCase() : 'all';
  let currentTag = 'all';

  // keep grouping state (true = show grouped headers / keep items in their lists)
  let groupByYears = groupToggle ? !!groupToggle.checked : true;

  function parseStoredState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function normalizeGroupValue(value) {
    if (value === '1' || value === 'true') return true;
    if (value === '0' || value === 'false') return false;
    return null;
  }

  function getUrlState() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    const status = params.get('status');
    const groupRaw = params.get('group');
    const group = normalizeGroupValue(groupRaw);
    if (!tag && !status && group === null) return null;
    return {
      tag: tag || null,
      status: status || null,
      groupByYears: group
    };
  }

  function persistState() {
    const payload = {
      tag: currentTag,
      status: currentStatus,
      groupByYears: groupByYears
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      // ignore storage failures (private mode, disabled, etc.)
    }

    const url = new URL(window.location.href);
    url.searchParams.set('tag', currentTag);
    url.searchParams.set('status', currentStatus);
    url.searchParams.set('group', groupByYears ? '1' : '0');
    window.history.replaceState({}, '', url);
  }
  if (groupToggle) {
    groupToggle.addEventListener('change', () => {
      groupByYears = !!groupToggle.checked;
      persistState();
      applyFilters();
    });
  }

  // store original positions so we can restore later
  const originalPos = new Map();
  bookCards.forEach(card => {
    originalPos.set(card, { parent: card.parentNode, next: card.nextSibling });
  });

  // create a container for filtered results (insert after the filter fieldset)
  let filteredContainer = document.getElementById('filtered-results');
  if (!filteredContainer) {
    const fieldset = document.querySelector('fieldset.filtering');
    const filterWrapper = document.querySelector('.filtering-details') || fieldset;
    filteredContainer = document.createElement('ol');
    filteredContainer.id = 'filtered-results';
    filteredContainer.className = 'bookshelf filter-grid filtered-row';
    filteredContainer.style.display = 'none';
    if (filterWrapper && filterWrapper.parentNode) {
      filterWrapper.parentNode.insertBefore(filteredContainer, filterWrapper.nextSibling);
    } else {
      document.body.insertBefore(filteredContainer, document.body.firstChild);
    }
  }

  function moveToFiltered(cards) {
    while (filteredContainer.firstChild) filteredContainer.removeChild(filteredContainer.firstChild);
    cards.forEach(c => filteredContainer.appendChild(c));
    filteredContainer.style.display = cards.length ? '' : 'none';
  }

  function restoreOriginalPositions() {
    bookCards.forEach(card => {
      const pos = originalPos.get(card);
      if (!pos) return;
      pos.parent.insertBefore(card, pos.next);
    });
    filteredContainer.style.display = 'none';
  }

  // Helper: treat "read" filter as including both "read" and "currently-reading"
  function statusMatchesKey(bookStatus, statusKey) {
    if (!statusKey || statusKey === 'all') return true;
    if (statusKey === 'read') {
      return bookStatus === 'read' || bookStatus === 'currently-reading';
    }
    return bookStatus === statusKey;
  }

  // counts (use this helper so counts include currently-reading when statusKey === 'read')
  function computeTagCountsForStatus(statusKey) {
    const counts = new Map();
    bookCards.forEach(card => {
      const cardStatus = (card.getAttribute('data-status') || '').toLowerCase();
      if (!statusMatchesKey(cardStatus, statusKey)) return;
      const raw = card.getAttribute('data-tags') || '';
      const tags = raw.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
      tags.forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1));
    });
    return counts;
  }

  function countForStatus(statusKey) {
    if (!statusKey || statusKey === 'all') return bookCards.length;
    return bookCards.filter(c => statusMatchesKey((c.getAttribute('data-status') || '').toLowerCase(), statusKey)).length;
  }

  // update tag radio labels so counts reflect the currently selected status
  function updateFilterLabels() {
    const counts = computeTagCountsForStatus(currentStatus);
    filterRadios.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label) return;
      if (!label.dataset.baseText) {
        label.dataset.baseText = label.textContent.replace(/\s*\(\d+\)$/, '').trim();
      }
      const base = label.dataset.baseText;
      const value = input.value.toLowerCase();

      // rebuild safe label content
      label.textContent = base + ' ';
      const countSpan = document.createElement('span');
      countSpan.className = 'filter-count';

      if (value === 'all') {
        countSpan.textContent = `(${countForStatus(currentStatus)})`;
      } else {
        countSpan.textContent = `(${counts.get(value) || 0})`;
      }

      label.appendChild(countSpan);
    });
  }

  const emptyStateEl = document.getElementById('empty-state');

  // apply both currentTag and currentStatus to show matching cards
  function applyFilters() {
    const statusKey = currentStatus;
    const tagKey = currentTag;

    bookCards.forEach(card => {
      const cardStatus = (card.getAttribute('data-status') || '').toLowerCase();
      const rawTags = card.getAttribute('data-tags') || '';
      const tags = rawTags.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);

      const statusMatches = statusMatchesKey(cardStatus, statusKey);
      const tagMatches = (tagKey === 'all') || (tags.includes(tagKey));

      card.style.display = (statusMatches && tagMatches) ? '' : 'none';
    });

    const filterActive = (statusKey !== 'all') || (tagKey !== 'all');

    // If grouping is enabled, keep year headers and lists visible and do not flatten
    if (groupByYears) {
      restoreOriginalPositions();
      headers.forEach(h => h.style.display = '');
      bookLists.forEach(l => l.style.display = '');
      if (filteredContainer) filteredContainer.style.display = 'none';
    } else {
      if (!filterActive) {
        restoreOriginalPositions();
        headers.forEach(h => h.style.display = '');
        bookLists.forEach(l => l.style.display = '');
      } else {
        headers.forEach(h => h.style.display = 'none');
        const visible = bookCards.filter(c => c.style.display !== 'none');
        moveToFiltered(visible);
        bookLists.forEach(l => l.style.display = 'none');
      }
    }

    // show empty state when no visible cards
    const visibleCount = bookCards.filter(c => c.style.display !== 'none').length;
    if (emptyStateEl) {
      emptyStateEl.hidden = visibleCount > 0;
    }

    updateFilterLabels();
    if (typeof updateBookCounts === 'function') updateBookCounts();
  }

  // wire tag radios: selecting a tag should NOT reset status; it filters within the current status
  filterRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      currentTag = (this.value || 'all').toLowerCase();
      persistState();
      applyFilters();
    });
  });

  // wire status select: status persists and updates radio counts; selecting a status keeps the radio selection
  if (statusSelect) {
    statusSelect.addEventListener('change', function() {
      currentStatus = (this.value || 'all').toLowerCase();

      // force grouping off for "want-to-read" and "currently-reading"
      if (currentStatus === 'want-to-read' || currentStatus === 'currently-reading') {
        groupByYears = false;
        if (groupToggle) groupToggle.checked = false;
      } else {
        // otherwise respect the checkbox (leave grouping as user-set)
        groupByYears = groupToggle ? !!groupToggle.checked : groupByYears;
      }

      // apply filters with the same selected tag (don't reset radios)
      persistState();
      applyFilters();
    });
  }

  // Show/hide more filters (if present)
  const toggleBtn = document.getElementById('toggle-filters');
  const moreFilters = document.getElementById('more-filters');
  if (toggleBtn && moreFilters) {
    toggleBtn.addEventListener('click', function() {
      const isHidden = moreFilters.style.display === 'none' || moreFilters.style.display === '';
      moreFilters.style.display = isHidden ? 'block' : 'none';
      toggleBtn.textContent = isHidden ? 'Hide more filters' : 'Show more filters';
    });
  }

  // Initial state
  headers.forEach(h => h.style.display = '');
  bookLists.forEach(l => l.style.display = '');
  // initialize currentStatus from select if present
  currentStatus = (statusSelect && statusSelect.value) ? statusSelect.value.toLowerCase() : 'all';
  // ensure the "all" tag radio is the default currentTag if one is checked, otherwise 'all'
  const checkedTag = filterRadios.find(r => r.checked);
  currentTag = checkedTag ? checkedTag.value.toLowerCase() : 'all';

  const urlState = getUrlState();
  const storedState = parseStoredState();
  const seedState = urlState || storedState;
  if (seedState) {
    if (seedState.status && statusSelect) currentStatus = seedState.status.toLowerCase();
    if (seedState.tag) currentTag = seedState.tag.toLowerCase();
    if (seedState.groupByYears !== null && seedState.groupByYears !== undefined) {
      groupByYears = !!seedState.groupByYears;
    }
  }

  // ensure checkbox and JS state are in sync on load
  if (groupToggle) {
    // if initial status is want-to-read/currently-reading, override grouping to off
    if (currentStatus === 'want-to-read' || currentStatus === 'currently-reading') {
      groupByYears = false;
      groupToggle.checked = false;
    } else {
      groupToggle.checked = !!groupByYears;
    }
  }

  if (statusSelect) statusSelect.value = currentStatus;
  const desiredTag = filterRadios.find(r => r.value.toLowerCase() === currentTag);
  if (desiredTag) desiredTag.checked = true;

  persistState();

  updateFilterLabels();
  applyFilters();
});