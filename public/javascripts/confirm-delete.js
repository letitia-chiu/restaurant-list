function confirmDelete(id) {
  if (confirm('確定要刪除嗎？')) {
    const form = document.getElementById('delete-restaurant')
    form.action = `/restaurant/${id}?_method=DELETE`
    form.submit()
  }
}