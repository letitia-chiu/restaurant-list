const message = document.querySelector('.message')

if (message) {
  setTimeout(function messageFadeout() {
    message.classList.add('hidden')
  }, 5000)
}