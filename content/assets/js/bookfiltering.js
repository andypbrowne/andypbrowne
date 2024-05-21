const filters = document.querySelectorAll('.filtering input')
const books = document.querySelectorAll('.book')
const counts = document.querySelectorAll('.bookCount')

filters.forEach(filter => {
  filter.addEventListener('change', () => {
    if(!document.startViewTransition) {
      filterBooks(filter.value)
      updateCounts()
      return
    }
    document.startViewTransition(() => {
      filterBooks(filter.value)
      updateCounts()
    })
  })
})
filterBooks = (filter) => {
  books.forEach(book => {
    if(filter === 'all') {
      book.hidden = false
      return
    }
    book.hidden = !book.dataset.tags.includes(filter)
  })
}
// updateCounts = () => {
//   counts.forEach(count => {
//     const books = count.parentElement.nextElementSibling.querySelectorAll('.book:not([hidden])')
//     count.textContent = `${books.length} book${books.length === 1 ? '' : 's'}`
//   })
// }