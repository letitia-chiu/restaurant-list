const message = document.querySelector('.message')

setTimeout(function messageFadeout() {
  message.classList.add('hidden')
}, 5000)