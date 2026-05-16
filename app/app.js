const enterBtn = document.getElementById('enterBtn');

const welcomeScreen = document.querySelector('.welcome-screen');
const homeScreen = document.querySelector('.home-screen');

enterBtn.addEventListener('click', () => {

  welcomeScreen.style.display = 'none';
  homeScreen.classList.remove('hidden');

});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {

  
} navigator.serviceWorker.register('./service-worker.js')
      .then(() => console.log('PWA Ready'));

  }
});
