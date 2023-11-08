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

// Press enter to change page
function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('page-form').submit();
  }
}