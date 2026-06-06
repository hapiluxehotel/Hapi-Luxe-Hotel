const enterBtn = document.getElementById('enterBtn');

const welcomeScreen = document.querySelector('.welcome-screen');
const homeScreen = document.querySelector('.home-screen');

enterBtn.addEventListener('click', () => {
  
const music = new Audio('welcome.mp3');
  music.volume = 0.3;
  music.play();
  
  const speech = new SpeechSynthesisUtterance(
    "Xin chào, chào mừng quý khách đến với Hapi Luxe Hotel."
  );

  speech.lang = "vi-VN";
  speech.rate = 0.95;

  speechSynthesis.speak(speech);

  setTimeout(() => {

    welcomeScreen.style.display = 'none';
    homeScreen.classList.remove('hidden');

  }, 1000);

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
