package main

import (
	"context"
	"math/rand"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// enum for the card suits
type CardSuit int

const (
	Hearts   CardSuit = 0
	Diamonds CardSuit = 1
	Clubs    CardSuit = 2
	Spades   CardSuit = 3
)

// TODO naming on these is bad
// Can be indexed by card value to get a string representation
var cardValueWords = [...]string{"Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"}
var cardValueDisplayStrings = [...]string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}

func (a *App) CardValueToDisplayString(cv int) string {
	if cv < 0 || cv > 13 {
		return ""
	}

	return cardValueDisplayStrings[cv-1]
}

func (a *App) CardValueToWord(cv int) string {
	if cv < 0 || cv > 13 {
		return ""
	}

	return cardValueWords[cv-1]
}

// Struct that represents a single playing card
type Card struct {
	Value int
	Suit  CardSuit
	IsRed bool
}

// Returns a random card
func (a *App) MakeRandomCard() Card {
	// randInstance := rand.

	thisVal := rand.Intn(12)
	thisSuit := rand.Intn(4)

	return Card{
		Value: thisVal,
		Suit:  CardSuit(thisSuit),
		IsRed: thisSuit < 2,
	}

}

// Struct that holds a collection of cards
type Deck struct {
	Cards []Card
}

// Returns a standard 52-card deck
func (a *App) NewStandardDeck() Deck {
	// one of each value, in each suit
	//n^2 moment

	outDeck := Deck{}
	outDeckContainer := []Card{}

	// each value
	// Values 11, 12, 13 are Jack, Queen, King, respectively.
	for val := 1; val < 14; val++ {
		// each suit
		for suit := 0; suit < 4; suit++ {
			outDeckContainer = append(outDeckContainer, Card{
				Value: val,
				Suit:  CardSuit(suit),
				IsRed: suit < 2,
			})
		}
	}

	outDeck.Cards = outDeckContainer

	return outDeck
}
