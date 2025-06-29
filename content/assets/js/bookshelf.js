document.addEventListener('DOMContentLoaded', function() {
  const filterRadios = document.querySelectorAll('input[name="filter"]');
  const bookCards = document.querySelectorAll('.book-card, .filter-grid-item');
  const headers = document.querySelectorAll('.bookshelf-header');
  const bookLists = document.querySelectorAll('ol.bookshelf.filter-grid');

  function updateBookCounts() {
    bookLists.forEach((list, i) => {
      const visibleBooks = list.querySelectorAll('li:not([style*="display: none"])').length;
      const countSpan = headers[i]?.querySelector('.bookcount');
      if (countSpan) {
        countSpan.textContent = `${visibleBooks} total books`;
      }
    });
  }

  filterRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const value = this.value;
      bookCards.forEach(card => {
        // Tag splitting logic for both comma and space separation
        const tags = (card.getAttribute('data-tags') || '').split(/[\s,]+/);
        if (value === 'all') {
          card.style.display = '';
        } else {
          card.style.display = tags.includes(value) ? '' : 'none';
        }
      });

      updateBookCounts();
    });
  });

  // Show/hide more filters
  const toggleBtn = document.getElementById('toggle-filters');
  const moreFilters = document.getElementById('more-filters');
  if (toggleBtn && moreFilters) {
    toggleBtn.addEventListener('click', function() {
      const isHidden = moreFilters.style.display === 'none';
      moreFilters.style.display = isHidden ? '' : 'none';
      toggleBtn.textContent = isHidden ? 'Hide more filters' : 'Show more filters';
    });
  }

  // Initial count update
  updateBookCounts();
});