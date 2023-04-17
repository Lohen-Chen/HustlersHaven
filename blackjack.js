var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; 

var hidden;
var deck;


var canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    let hiddenImg = document.createElement("img");
    hiddenImg.id = "hidden";
    hiddenImg.src = "./cards/BACK.png";
    document.getElementById("dealer-cards").appendChild(hiddenImg);
    
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    if(checkBust()){
        message = checkWinState();
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        document.getElementById("results").innerText = message;
      document.getElementById("results").style.color = getColor();
        document.getElementById("your-sum").innerText = yourSum;
        genButton();
        canHit = false;
    } else {
        console.log(yourSum);
        document.getElementById("hit").addEventListener("click", hit);
        document.getElementById("stay").addEventListener("click", stay);
    }
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    } 
  if(checkBust()){
      message = checkWinState();
      document.getElementById("results").innerText = message;
    document.getElementById("results").style.color = getColor();
      dealerSum = reduceAce(dealerSum, dealerAceCount);
      document.getElementById("dealer-sum").innerText = dealerSum;
      yourSum = reduceAce(yourSum, yourAceCount);
      document.getElementById("hidden").src = "./cards/" + hidden + ".png";
      document.getElementById("your-sum").innerText = yourSum;
      genButton();
      canHit = false;
    }
}

function stay() {
    if (!canHit) {
        return;
    }
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = checkWinState();
    
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
  document.getElementById("results").style.color = getColor();
    genButton();
    canHit = false;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount--;
    }
    return playerSum;
}

function checkWinState(){
  let message = "";
  if (yourSum > 21) {
        message = "BUST!";
    }
    else if (dealerSum > 21) {
        message = "Dealer BUST!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }
  return message;
}

function checkBust(){
  let dealerTempSum = reduceAce(dealerSum, dealerAceCount);
  let yourTempSum = reduceAce(yourSum, yourAceCount);
  if (yourTempSum > 21) {
        return true;
    }
    else if (dealerTempSum > 21) {
      return true;
  } else {
      return false;
  }
}

function getColor() {
  let winstate = checkWinState();
  if (winstate === "BUST!") {
    return "red";
  } else if (winstate === "Dealer BUST!") {
    return "green";
  } else if (winstate === "Tie!") {
    return "black";
  } else if (winstate === "You Win!") {
    return "green";
  } else if (winstate === "You Lose!") {
    return "red";
  } else {
    return "black";
  }
}

function genButton(){
  
  const button = document.createElement("button");
  button.textContent = "New Round";
  button.id = "new-round";
  const buttons = document.getElementById("buttons");
  buttons.appendChild(button);
  document.getElementById("new-round").addEventListener("click", newRound);
}

function newRound(){
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0; 
    deck = [];
    hidden = "BACK";
    canHit = true;
    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("dealer-sum").innerHTML = "";
    document.getElementById("your-sum").innerHTML = "";
    document.getElementById("results").innerText = "";
    document.getElementById("buttons").removeChild(document.getElementById("new-round"));
    buildDeck();
    shuffleDeck();
    startGame();
}

document.getElementById("hello").addEventListener("click", test);

function test(){
  fetch('/bet', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
})
.then(response => {
  // Handle the response from the server
  console.log(response);
})
.catch(error => {
  // Handle errors that may occur
  console.error(error);
});
}