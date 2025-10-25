document.addEventListener('DOMContentLoaded', function() {
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
  if (groupToggle) {
    groupToggle.addEventListener('change', () => {
      groupByYears = !!groupToggle.checked;
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
    filteredContainer = document.createElement('ol');
    filteredContainer.id = 'filtered-results';
    filteredContainer.className = 'bookshelf filter-grid filtered-row';
    filteredContainer.style.display = 'none';
    if (fieldset && fieldset.parentNode) {
      fieldset.parentNode.insertBefore(filteredContainer, fieldset.nextSibling);
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

  // counts of tags restricted by a status (status = 'all' means no restriction)
  function computeTagCountsForStatus(status) {
    const counts = new Map();
    bookCards.forEach(card => {
      const cardStatus = (card.getAttribute('data-status') || '').toLowerCase();
      if (status !== 'all' && cardStatus !== status) return;
      const raw = card.getAttribute('data-tags') || '';
      const tags = raw.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
      tags.forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1));
    });
    return counts;
  }

  // total number of books for a given status
  function countForStatus(status) {
    if (status === 'all') return bookCards.length;
    return bookCards.filter(c => (c.getAttribute('data-status') || '').toLowerCase() === status).length;
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

  // apply both currentTag and currentStatus to show matching cards
  function applyFilters() {
    const statusKey = currentStatus;
    const tagKey = currentTag;

    bookCards.forEach(card => {
      const cardStatus = (card.getAttribute('data-status') || '').toLowerCase();
      const rawTags = card.getAttribute('data-tags') || '';
      const tags = rawTags.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);

      const statusMatches = (statusKey === 'all') || (cardStatus === statusKey);
      const tagMatches = (tagKey === 'all') || (tags.includes(tagKey));

      card.style.display = (statusMatches && tagMatches) ? '' : 'none';
    });

    const filterActive = (statusKey !== 'all') || (tagKey !== 'all');

    // If grouping is enabled, keep year headers and lists visible and do not flatten
    if (groupByYears) {
      // ensure items are in their original lists and headers shown
      restoreOriginalPositions();
      headers.forEach(h => h.style.display = '');
      bookLists.forEach(l => l.style.display = '');
      // hide the flattened container
      if (filteredContainer) filteredContainer.style.display = 'none';
    } else {
      // previous behavior: flatten when a filter is active
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

    updateFilterLabels();
    if (typeof updateBookCounts === 'function') updateBookCounts();
  }

  // wire tag radios: selecting a tag should NOT reset status; it filters within the current status
  filterRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      currentTag = (this.value || 'all').toLowerCase();
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

  // ensure checkbox and JS state are in sync on load
  if (groupToggle) {
    // if initial status is want-to-read/currently-reading, override grouping to off
    if (currentStatus === 'want-to-read' || currentStatus === 'currently-reading') {
      groupByYears = false;
      groupToggle.checked = false;
    } else {
      groupByYears = !!groupToggle.checked;
    }
  }

  updateFilterLabels();
  applyFilters();
});