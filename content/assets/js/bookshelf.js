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
  const coversToggle = document.getElementById('covers-only');
  const bookCards = Array.from(document.querySelectorAll('.book-card, .filter-grid-item'));
  const headers = document.querySelectorAll('.bookshelf-header');
  const bookLists = document.querySelectorAll('ol.bookshelf.filter-grid');

  // track current selections (persist status across tag changes)
  let currentStatus = (statusSelect && statusSelect.value) ? statusSelect.value.toLowerCase() : 'all';
  let currentTag = 'all';

  // keep grouping state (true = show grouped headers / keep items in their lists)
  let groupByYears = groupToggle ? !!groupToggle.checked : true;
  let coversOnly = coversToggle ? !!coversToggle.checked : false;

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
    const covers = normalizeGroupValue(params.get('covers'));
    if (!tag && !status && group === null && covers === null) return null;
    return {
      tag: tag || null,
      status: status || null,
      groupByYears: group,
      coversOnly: covers
    };
  }

  function persistState(options) {
    const payload = {
      tag: currentTag,
      status: currentStatus,
      groupByYears: groupByYears,
      coversOnly: coversOnly
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
    url.searchParams.set('covers', coversOnly ? '1' : '0');
    if (options && options.clearHash) {
      url.hash = '';
    }
    window.history.replaceState({}, '', url);
  }
  if (groupToggle) {
    groupToggle.addEventListener('change', () => {
      groupByYears = !!groupToggle.checked;
      persistState();
      applyFilters();
    });
  }

  function applyCoversOnly() {
    document.documentElement.classList.toggle('covers-only', coversOnly);
    if (coversToggle) coversToggle.checked = !!coversOnly;
  }

  if (coversToggle) {
    coversToggle.addEventListener('change', () => {
      coversOnly = !!coversToggle.checked;
      applyCoversOnly();
      persistState();
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
      if (!pos || !pos.parent) return;
      pos.parent.appendChild(card);
    });
    if (filteredContainer) filteredContainer.style.display = 'none';
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

    // Grouping on: keep year headers and lists. Off: one flat shelf of visible cards.
    if (groupByYears) {
      restoreOriginalPositions();
      headers.forEach(h => h.style.display = '');
      bookLists.forEach(l => l.style.display = '');
      if (filteredContainer) filteredContainer.style.display = 'none';
    } else {
      headers.forEach(h => h.style.display = 'none');
      const visible = bookCards.filter(c => c.style.display !== 'none');
      moveToFiltered(visible);
      bookLists.forEach(l => l.style.display = 'none');
    }

    bookCards.forEach(c => c.classList.remove('book-find-target'));

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
      persistState({ clearHash: true });
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
      persistState({ clearHash: true });
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

  const coversSeed = (urlState && urlState.coversOnly !== null && urlState.coversOnly !== undefined)
    ? urlState.coversOnly
    : (storedState && storedState.coversOnly);
  if (coversSeed !== null && coversSeed !== undefined) {
    coversOnly = !!coversSeed;
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
  applyCoversOnly();

  const SECTION_LABELS = {
    '2026': '2026',
    '2025': '2025',
    '2024': '2024',
    '2023': '2023',
    '2022': '2022',
    '2019-2021': '2019 to 2021',
    '2016-2018': '2016 to 2018',
    'older': 'Older Notable Reads'
  };

  function calculateFuzzyScore(name, query) {
    const lowerName = String(name || '').toLowerCase();
    let queryIdx = 0;
    let score = 0;
    let consecutiveMatches = 0;

    if (lowerName.includes(query)) {
      return 1000;
    }

    for (let i = 0; i < lowerName.length && queryIdx < query.length; i++) {
      if (lowerName[i] === query[queryIdx]) {
        queryIdx++;
        consecutiveMatches++;

        const isWordBoundary = i === 0 || lowerName[i - 1] === ' ';
        if (isWordBoundary) {
          score += 100;
        } else if (consecutiveMatches > 1) {
          score += 50;
        } else {
          score += 10;
        }
      } else {
        consecutiveMatches = 0;
      }
    }

    return queryIdx === query.length ? score : 0;
  }

  function selectBook(id, options) {
    const writeHash = !options || options.writeHash !== false;

    currentTag = 'all';
    currentStatus = 'all';
    const allRadio = filterRadios.find(r => r.value.toLowerCase() === 'all');
    if (allRadio) allRadio.checked = true;
    if (statusSelect) statusSelect.value = 'all';

    persistState();
    applyFilters();

    const card = document.getElementById(id);
    if (!card) return;

    card.style.display = '';
    const list = card.closest('ol.bookshelf');
    if (list) list.style.display = '';
    const header = list && list.previousElementSibling;
    if (header && header.classList.contains('bookshelf-header')) {
      header.style.display = '';
    }

    if (writeHash) {
      const url = new URL(window.location.href);
      url.hash = id;
      window.history.replaceState({}, '', url);
    }

    if (filterDetails && window.innerWidth < 676) {
      filterDetails.removeAttribute('open');
    }

    const jumpToCard = () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      card.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      card.classList.add('book-find-target');
      if (coversOnly) {
        const link = card.querySelector('a');
        if (link) link.focus({ preventScroll: true });
      } else {
        const heading = card.querySelector('h3');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
        }
      }
      window.setTimeout(() => card.classList.remove('book-find-target'), 1800);
    };

    requestAnimationFrame(() => requestAnimationFrame(jumpToCard));
  }

  function honorHash() {
    const id = (window.location.hash || '').replace(/^#/, '');
    if (id && document.getElementById(id)) {
      selectBook(id, { writeHash: false });
    }
  }

  window.addEventListener('hashchange', honorHash);
  honorHash();

  const findInput = document.getElementById('bookshelf-find-input');
  const findList = document.getElementById('bookshelf-find-list');
  const findLive = document.getElementById('bookshelf-find-live');
  const findClear = document.getElementById('bookshelf-find-clear');

  if (findInput && findList) {
    const bookIndex = bookCards.map(card => ({
      id: card.id,
      title: card.getAttribute('data-title') || '',
      author: card.getAttribute('data-author') || '',
      section: card.getAttribute('data-section') || ''
    })).filter(book => book.id && book.title);

    let findMatches = [];
    let findIndex = 0;

    function closeFindList() {
      findList.hidden = true;
      findList.innerHTML = '';
      findInput.setAttribute('aria-expanded', 'false');
      findInput.removeAttribute('aria-activedescendant');
      findMatches = [];
      findIndex = 0;
    }

    function announceFind(message) {
      if (findLive) findLive.textContent = message;
    }

    function renderFindList() {
      findList.innerHTML = '';
      const query = findInput.value.trim();

      if (!query) {
        closeFindList();
        announceFind('');
        return;
      }

      const lowerQuery = query.toLowerCase();
      findMatches = bookIndex
        .map(book => ({
          book,
          score: Math.max(
            calculateFuzzyScore(book.title, lowerQuery),
            calculateFuzzyScore(book.author, lowerQuery)
          )
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(item => item.book);

      findIndex = 0;
      findList.hidden = false;
      findInput.setAttribute('aria-expanded', 'true');

      if (findMatches.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'bookshelf-find-empty';
        empty.setAttribute('role', 'presentation');
        empty.textContent = 'No matching books';
        findList.appendChild(empty);
        findInput.removeAttribute('aria-activedescendant');
        announceFind('No matching books');
        return;
      }

      findMatches.forEach((book, idx) => {
        const option = document.createElement('li');
        const optionId = `bookshelf-find-opt-${idx}`;
        option.id = optionId;
        option.className = 'bookshelf-find-option';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');

        const title = document.createElement('span');
        title.className = 'bookshelf-find-option-title';
        title.textContent = book.title;

        const meta = document.createElement('span');
        meta.className = 'bookshelf-find-option-meta';
        const year = SECTION_LABELS[book.section] || book.section;
        meta.textContent = year ? `${book.author} · ${year}` : book.author;

        option.appendChild(title);
        option.appendChild(meta);
        option.addEventListener('mousedown', (event) => {
          event.preventDefault();
          chooseFindMatch(idx);
        });
        findList.appendChild(option);
      });

      findInput.setAttribute('aria-activedescendant', 'bookshelf-find-opt-0');
      announceFind(`${findMatches.length} match${findMatches.length === 1 ? '' : 'es'}`);
    }

    function highlightFindOption(nextIndex) {
      if (!findMatches.length) return;
      findIndex = nextIndex;
      const options = findList.querySelectorAll('[role="option"]');
      options.forEach((option, idx) => {
        option.setAttribute('aria-selected', idx === findIndex ? 'true' : 'false');
      });
      const active = options[findIndex];
      if (active) {
        findInput.setAttribute('aria-activedescendant', active.id);
        active.scrollIntoView({ block: 'nearest' });
      }
    }

    function chooseFindMatch(idx) {
      const book = findMatches[idx];
      if (!book) return;
      findInput.value = book.title;
      if (findClear) findClear.hidden = false;
      closeFindList();
      announceFind(`Showing ${book.title}`);
      selectBook(book.id);
    }

    function syncFindClear() {
      if (!findClear) return;
      findClear.hidden = findInput.value.length === 0;
    }

    findInput.addEventListener('input', () => {
      syncFindClear();
      renderFindList();
    });

    findInput.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        if (findList.hidden) renderFindList();
        if (!findMatches.length) return;
        event.preventDefault();
        highlightFindOption(Math.min(findIndex + 1, findMatches.length - 1));
      } else if (event.key === 'ArrowUp') {
        if (findList.hidden || !findMatches.length) return;
        event.preventDefault();
        highlightFindOption(Math.max(findIndex - 1, 0));
      } else if (event.key === 'Enter') {
        if (findList.hidden) renderFindList();
        if (!findMatches.length) return;
        event.preventDefault();
        chooseFindMatch(findIndex);
      } else if (event.key === 'Escape') {
        if (!findList.hidden) {
          event.preventDefault();
          closeFindList();
        } else if (findInput.value) {
          event.preventDefault();
          findInput.value = '';
          syncFindClear();
          announceFind('');
        }
      }
    });

    findInput.addEventListener('blur', () => {
      window.setTimeout(() => {
        if (document.activeElement !== findInput) closeFindList();
      }, 100);
    });

    if (findClear) {
      findClear.addEventListener('click', () => {
        findInput.value = '';
        syncFindClear();
        closeFindList();
        announceFind('');
        findInput.focus();
      });
    }
  }
});