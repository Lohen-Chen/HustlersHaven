const slotImages = [
	'https://dummyimage.com/100x100/ff0000/ffffff&text=Cherry',
	'https://dummyimage.com/100x100/00ff00/ffffff&text=Orange',
	'https://dummyimage.com/100x100/0000ff/ffffff&text=Banana',
	'https://dummyimage.com/100x100/ffff00/000000&text=Apple',
	'https://dummyimage.com/100x100/ff00ff/ffffff&text=Grapes'
];

const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spin-button');

let isSpinning = false;

function spin() {
  if (isSpinning) {
    return;
  }

  isSpinning = true;

  let counter = 0;
  let shuffledImages = shuffleArray(slotImages);

  const intervalId1 = setInterval(() => {
    slot1.style.backgroundImage = `url('${shuffledImages[counter % shuffledImages.length]}')`;
    counter++;
  }, 100);

  const intervalId2 = setInterval(() => {
    slot2.style.backgroundImage = `url('${shuffledImages[counter % shuffledImages.length]}')`;
    counter++;
  }, 100);

  const intervalId3 = setInterval(() => {
    slot3.style.backgroundImage = `url('${shuffledImages[counter % shuffledImages.length]}')`;
    counter++;

    if (counter > 50) {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
      isSpinning = false;
      checkForWin();
    }
  }, 100);
}

function shuffleArray(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function checkForWin() {
	if (slot1.style.backgroundImage === slot2.style.backgroundImage && slot2.style.backgroundImage === slot3.style.backgroundImage) {
		alert('You win!');
	}
}

spinButton.addEventListener('click', spin);

document.addEventListener('keydown', function(e) {
  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    if(isSpinning == false){
      spin();
    }
  }
});