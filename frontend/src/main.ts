import "./style.css";
import "./tailwind_dist/style_tw.css";

import {
  CardValueToDisplayString,
  NewStandardDeck,
} from "../wailsjs/go/card/CardLib";

import {DefaultConfig, NewDefaultGame} from "../wailsjs/go/blackjack/BlackjackLib"
import {BlackjackGame} from "../wailsjs/go/blackjack/BlackjackGame"
import "../wailsjs/go/blackjack/BlackjackCfg"

// TODO
// - Doesn't handle natural blackjack advantage over other blackjack
// - Evaluate my RNG source
// - Card draw animations?

// var thisCardDeck: any;
// var playerCards: any[] = [];
// var dealerCards: any[] = [];

// const DEALER_STANDS_ON = 17;

// var isGameRunning: boolean = true;

var blackjack_game_instance: blackjack.BlackjackGame;

declare global {
  interface Window {
    // greet: () => void;
  }
}

function startGame() {
  isGameRunning = true;
  console.log(
    "🔎 ~ file: main.ts:30 ~ startGame ~ isGameRunning",
    isGameRunning
  );
  (document.getElementById("hit-button")! as HTMLButtonElement).disabled =
    false;
  (document.getElementById("stand-button")! as HTMLButtonElement).disabled =
    false;
}

function stopGame() {
  isGameRunning = false;
  console.log(
    "🔎 ~ file: main.ts:39 ~ stopGame ~ isGameRunning",
    isGameRunning
  );
  (document.getElementById("hit-button")! as HTMLButtonElement).disabled = true;
  (document.getElementById("stand-button")! as HTMLButtonElement).disabled =
    true;
}

function addDealerCard(card: any) {
  let cardSuitChar = "";

  // These unicode characters are the outlined version
  switch (card.Suit!) {
    case 0:
      cardSuitChar = "\u2661"; // hearts
      break;
    case 1:
      cardSuitChar = "\u2662"; // diamonds
      break;
    case 2:
      cardSuitChar = "\u2664"; // clubs
      break;
    case 3:
      cardSuitChar = "\u2664"; // spades
      break;
  }

  CardValueToDisplayString(card.Value).then((val) => {
    document.querySelector("#card-container")!.innerHTML += `
        <div class="card-item rounded-xl cursor-default"> 
            <div class="card-value-top text-xl">${val}</div>
            <div class="card-center text-8xl ${
              card.IsRed ? "text-red-600" : "text-white"
            }">${cardSuitChar}</div>
            <div class="card-value-bot text-xl">${val}</div>
        </div>
    `;
  });

  dealerCards.push(card);
  calcDealerHand();
}

function clearAllHands() {
  // TODO using querySelector in some places, and getElementByID in others
  document.querySelector("#card-container")!.innerHTML = "";
  document.querySelector("#player-card-container")!.innerHTML = "";

  dealerCards = [];
  playerCards = [];
}

function initGame(): void {
  clearAllHands();

  addDealerCard(pickCard());

  addPlayerCard(pickCard());
  addPlayerCard(pickCard());

  // check for natural blackjack
  if (handBestValue(playerCards) === 21) {
    console.log("*******Natural blackjack");

    // check if dealer also has one
    addDealerCard(pickCard());

    if (handBestValue(dealerCards) === 21) {
      console.log("*******Dealer ALSO ties");
      gameTie();
    } else {
      playerWin();
    }
  }
}

// Main game interaction base
function doGameAction(action: string) {
  switch (action) {
    case "stand":
      actionStand();
      // dealerActionStand()
      break;
    case "hit":
      actionHit();
      // dealerActionHit()
      break;
  }
}

function actionHit() {
  if (thisCardDeck.Cards.length === 0) {
    console.error("The card deck is empty");
    return;
  }
  addPlayerCard(pickCard());

  if (handBestValue(playerCards) > 21) {
    console.log("********** Player bust");
    dealerWin();
  } else if (handBestValue(playerCards) === 21) {
    console.log("********** Player Blackjack");
    playerWin();
  }
}

function actionStand() {
  if (thisCardDeck.Cards.length === 0) {
    console.error("The card deck is empty");
    return;
  }

  console.log("Stand button pressed");
  // addDealerCard(pickCard());
  dealerPlayOnStand();
}

function dealerPlayOnStand() {
  // hit until stand point
  while (handBestValue(dealerCards) < DEALER_STANDS_ON) {
    addDealerCard(pickCard());
  }

  // check for dealer bust
  if (handBestValue(dealerCards) > 21) {
    console.log("******* Dealer bust");
    playerWin();
  }

  // Check for dealer win
  else if (handBestValue(dealerCards) > handBestValue(playerCards)) {
    dealerWin();
  }

  // Check for tie
  else if (handBestValue(dealerCards) == handBestValue(playerCards)) {
    gameTie();
  } else {
    playerWin();
  }
}

function gameTie() {
  console.log("********** Game Hit");
  stopGame();
  openResultsOverlay("No one");
}

function dealerWin() {
  console.log("********** Dealer wins");
  stopGame();
  openResultsOverlay("Dealer");
}

function playerWin() {
  console.log("********** Player wins");
  stopGame();
  openResultsOverlay("Player");
}

function hitButtonCallback() {
  doGameAction("hit");
}

function standButtonCallback() {
  doGameAction("stand");
}

function calcPlayerHand() {
  let playerHandValueAcesOne = calculateHandValue(playerCards, true);
  let playerHandValueAcesEleven = calculateHandValue(playerCards, false);

  document.getElementById("player-hand-value-span")!.innerHTML =
    playerHandValueAcesOne.toString();

  if (playerHandValueAcesEleven > playerHandValueAcesOne) {
    document.getElementById(
      "player-hand-value-span"
    )!.innerHTML += ` (${playerHandValueAcesEleven})`;
  }
}

function calcDealerHand() {
  let dealerHandValueAcesOne = calculateHandValue(dealerCards, true);
  let dealerHandValueAcesEleven = calculateHandValue(dealerCards, false);

  document.getElementById("dealer-hand-value-span")!.innerHTML =
    dealerHandValueAcesOne.toString();

  if (dealerHandValueAcesEleven != dealerHandValueAcesOne) {
    document.getElementById(
      "dealer-hand-value-span"
    )!.innerHTML += ` (${dealerHandValueAcesEleven})`;
  }
}

function handBestValue(hand: any[]): number {
  let bestScore: number = 0;

  let handSum = calculateHandValue(hand, true);
  let handSumWithAces = calculateHandValue(hand, false);

  // determine best score
  bestScore = handSum;
  if (handSumWithAces > handSum && handSumWithAces <= 21) {
    bestScore = handSumWithAces;
  }

  return bestScore;
}

function calculateHandValue(hand: any[], acesAsOne: boolean): number {
  let handSum;
  let numberOfAces;

  handSum = hand.reduce((accumulator, currentValue) => {
    let addVal = currentValue.Value;
    if (currentValue.Value > 10) {
      addVal = 10;
    }

    return accumulator + addVal;
  }, 0);

  numberOfAces = hand.reduce((acc, curr) => {
    if (curr.Value == 1) {
      return acc + 1;
    }

    return acc;
  }, 0);

  if (!acesAsOne) {
    if (numberOfAces > 0) {
      handSum = 10 * numberOfAces + handSum;
    }
  }

  return handSum;
}

function addPlayerCard(card: any): void {
  let cardSuitChar = "";

  // These unicode characters are the outlined version
  switch (card.Suit!) {
    case 0:
      cardSuitChar = "\u2661"; // hearts
      break;
    case 1:
      cardSuitChar = "\u2662"; // diamonds
      break;
    case 2:
      cardSuitChar = "\u2667"; // clubs
      break;
    case 3:
      cardSuitChar = "\u2664"; // spades
      break;
  }

  CardValueToDisplayString(card.Value).then((val) => {
    document.querySelector("#player-card-container")!.innerHTML += `
        <div class="player-card-item rounded-xl cursor-default"> 
            <div class="card-value-top text-xl">${val}</div>
            <div class="card-icon-top text-2xl ${
              card.IsRed ? "text-red-600" : "text-white"
            }">${cardSuitChar}</div>
            <div class="card-center text-8xl ${
              card.IsRed ? "text-red-600" : "text-white"
            }">${cardSuitChar}</div>
            <div class="card-value-bot text-xl">${val}</div>
        </div>
    `;
  });

  playerCards.push(card);
  calcPlayerHand();
}

// picks a random card from the file-level deck, removes it, and returns it
function pickCard(): any {
  if (thisCardDeck.Cards.length == 0) {
    console.error("The card deck is empty");
    return null;
  }
  let randIdx = Math.round(Math.random() * (thisCardDeck.Cards.length - 1));
  let returnCard = thisCardDeck.Cards[randIdx];

  thisCardDeck.Cards.splice(randIdx, 1);

  return returnCard;
}

function openResultsOverlay(winner: string) {
  console.log("Opening results...");

  let overlayContainer = document.getElementById("overlay-container");

  overlayContainer!.style.zIndex = "100";

  overlayContainer!.innerHTML = `
  <div class="w-2/3 h-1/3 bg-zinc-700 results-overlay">
  <h1 class="text-4xl">${winner} wins!</h1>
  <h3 class="text-2xl">Your hand was ${handBestValue(playerCards)}</h3>
  <h3 class="text-2xl">The dealer had ${handBestValue(dealerCards)}</h3>
  <button id="new-game-button" class="new-game-button game-button">New Game</button>
  </div>  
  `;

  // set the callback for the new game button (messy!)

  document.getElementById("new-game-button")!.onclick = newGame;
}

function newGame() {
  main();
  closeResultsOverlay();
  startGame();
}

function closeResultsOverlay() {
  let overlayContainer = document.getElementById("overlay-container");

  overlayContainer!.innerHTML = "";
  overlayContainer!.style.zIndex = "-100";
}

//===============================================================

function main() {
  NewDefaultGame().then(game => {
    blackjack_game_instance = game;
    DefaultConfig().then(cfg => {
      blackjack_game_instance.Config = cfg;
    });
  })
  // document.getElementById("dealer-stands-on-span")!.innerHTML =
  //   DEALER_STANDS_ON.toString();

  // NewStandardDeck().then((deck) => {
  //   thisCardDeck = deck;
  //   initGame();
  // });



  document.getElementById("hit-button")!.onclick = hitButtonCallback;
  document.getElementById("stand-button")!.onclick = standButtonCallback;
}
//###############################################################
//###############################################################
//###############################################################
//############################# MAIN ############################
//###############################################################
//###############################################################
//###############################################################

main();
