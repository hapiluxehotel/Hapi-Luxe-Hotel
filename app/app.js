const enterBtn = document.getElementById('enterBtn');

const welcomeScreen = document.querySelector('.welcome-screen');
const homeScreen = document.querySelector('.home-screen');

enterBtn.addEventListener('click', () => {

  const music = new Audio('welcome.mp3');

  music.volume = 0.5;

  music.play();

  welcomeScreen.style.display = 'none';
  homeScreen.classList.remove('hidden');

});

// if ('serviceWorker' in navigator) {

//   window.addEventListener('load', () => {

//     navigator.serviceWorker.register('./service-worker.js')
//       .then(() => console.log('PWA Ready'));

//   });

// }
function openService(type){

  if(type === 'room'){
    alert('Room Service Coming Soon');
  }

  if(type === 'guide'){
    alert('Hotel Guide Coming Soon');
  }

  if(type === 'nearby'){
    alert('Nearby Places Coming Soon');
  }

  if(type === 'cafe'){
    alert('Cafe & Drinks Coming Soon');
  }

  if(type === 'support'){
    alert('Support Coming Soon');
  }

  if(type === 'checkout'){
    alert('Fast Checkout Coming Soon');
  }

}
