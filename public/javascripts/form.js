const form = document.getElementById('create-form')

// Form validation
form.addEventListener('submit', function onFormSubmitted(event) {
  if (!form.checkValidity()) {
    event.stopPropagation()
    event.preventDefault()
    form.classList.add('was-validated')
  }
})

// Remove 'was-validated' when the form is cleared
form.addEventListener('reset', function onFormReset(event) {
  form.classList.remove('was-validated')
})