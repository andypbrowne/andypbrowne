document.addEventListener('DOMContentLoaded', function() {
  const filterRadios = document.querySelectorAll('input[name="filter"]');
  const bookCards = document.querySelectorAll('.book-card, .filter-grid-item');
  const headers = document.querySelectorAll('.bookshelf-header');

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

      // Hide or show bookshelf headers
      // headers.forEach(header => {
      //   header.style.display = (value === 'all') ? '' : 'none';
      // });
    });
  });
});