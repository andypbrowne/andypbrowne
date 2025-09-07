document.addEventListener('DOMContentLoaded', function() {
  const filterRadios = document.querySelectorAll('input[name="filter"]');
  const bookCards = Array.from(document.querySelectorAll('.book-card, .filter-grid-item'));
  const headers = document.querySelectorAll('.bookshelf-header');
  const bookLists = document.querySelectorAll('ol.bookshelf.filter-grid');

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
    // hide by default
    filteredContainer.style.display = 'none';
    if (fieldset && fieldset.parentNode) {
      fieldset.parentNode.insertBefore(filteredContainer, fieldset.nextSibling);
    } else {
      document.body.insertBefore(filteredContainer, document.body.firstChild);
    }
  }

  function moveToFiltered(cards) {
    // ensure container is empty
    while (filteredContainer.firstChild) filteredContainer.removeChild(filteredContainer.firstChild);
    cards.forEach(c => filteredContainer.appendChild(c));
    filteredContainer.style.display = cards.length ? '' : 'none';
  }

  function restoreOriginalPositions() {
    bookCards.forEach(card => {
      const pos = originalPos.get(card);
      if (!pos) return;
      // if already in correct parent and nextSibling, skip (or always insert to be safe)
      pos.parent.insertBefore(card, pos.next);
    });
    filteredContainer.style.display = 'none';
  }

  function collapseEmptyLists(value) {
    bookLists.forEach(list => {
      const visibleChildren = list.querySelectorAll('li:not([style*="display: none"])').length;
      list.style.display = (visibleChildren === 0 && value !== 'all') ? 'none' : '';
    });
  }

  filterRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const value = this.value.toLowerCase();

      // show/hide individual book cards based on tag match
      bookCards.forEach(card => {
        const raw = card.getAttribute('data-tags') || '';
        const tags = raw.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
        if (value === 'all') {
          card.style.display = '';
        } else {
          card.style.display = tags.includes(value) ? '' : 'none';
        }
      });

      // If filtering, move all visible cards into the single filtered row
      if (value === 'all') {
        // restore original layout
        restoreOriginalPositions();
        // show headers and lists
        headers.forEach(h => h.style.display = '');
        bookLists.forEach(l => l.style.display = '');
      } else {
        // hide headers
        headers.forEach(h => h.style.display = 'none');
        // collect visible cards
        const visible = bookCards.filter(c => c.style.display !== 'none');
        moveToFiltered(visible);
        // hide empty lists to avoid gaps
        bookLists.forEach(l => l.style.display = 'none');
      }

      // update counts if you keep that behaviour
      if (typeof updateBookCounts === 'function') updateBookCounts();
    });
  });

  // Show/hide more filters (existing logic)
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
  if (typeof updateBookCounts === 'function') updateBookCounts();
});