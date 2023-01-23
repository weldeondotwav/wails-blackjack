package card

import (
	"math/rand"

	"github.com/weldeondotwav/wails-blackjack/internal/util"
)

type CardLib struct {
	Deck *Deck `json:"deck,omitempty"`
}

func NewCardLib() *CardLib {
	return &CardLib{}
}

// Struct that holds a collection of cards
type Deck struct {
	Cards []Card `json:"cards,omitempty"`
}

type Card struct {
	Value int      `json:"value,omitempty"`
	Suit  CardSuit `json:"suit,omitempty"`
	IsRed bool     `json:"is_red,omitempty"`
}

// TODO naming on these is bad
// Can be indexed by card value to get a string representation
var cardValueWords = [...]string{"Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"}
var cardValueDisplayStrings = [...]string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}

// enum for the card suits
type CardSuit int

const (
	Hearts   CardSuit = 0
	Diamonds CardSuit = 1
	Clubs    CardSuit = 2
	Spades   CardSuit = 3
)

func (c *CardLib) CardValueToDisplayString(cv int) string {
	if cv < 0 || cv > 13 {
		return ""
	}

	return cardValueDisplayStrings[cv-1]
}

func (c *CardLib) CardValueToWord(cv int) string {
	if cv < 0 || cv > 13 {
		return ""
	}

	return cardValueWords[cv-1]
}

// Returns a rune with the unicode representation of the receiver card's suit.
func (c *Card) SuitUnicode() rune {
	switch c.Suit {
	case Spades:
		return '\u2664'
	case Clubs:
		return '\u2667'
	case Diamonds:
		return '\u2662'
	case Hearts:
		return '\u2661'
	}
	return '\u003f'
}

// Returns a random card
func (c *CardLib) MakeRandomCard() Card {
	// randInstance := rand.

	thisVal := rand.Intn(12)
	thisSuit := rand.Intn(4)

	return Card{
		Value: thisVal,
		Suit:  CardSuit(thisSuit),
		IsRed: thisSuit < 2,
	}

}

// Picks a random card from the receiver deck, removes it from the deck, and returns it.
func (d *Deck) PickRandom() *Card {
	pickIdx := rand.Intn(len(d.Cards))

	retCard := d.Cards[pickIdx]

	d.Cards = util.RemoveIndex(d.Cards, pickIdx)

	return &retCard;
}

func (c *CardLib) PickRandomN(deck *Deck, numToPick int) []Card {
	outCards := []Card{}

	for i := 0; i < numToPick; i++ {
		outCards = append(outCards, *deck.PickRandom())
	}

	return outCards
}

// Returns a standard 52-card deck
func (c *CardLib) NewStandardDeck() Deck {
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
