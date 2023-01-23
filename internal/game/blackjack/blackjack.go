package blackjack

import (
	"github.com/weldeondotwav/wails-blackjack/internal/card"
	"github.com/weldeondotwav/wails-blackjack/internal/util"
)

// Implementation of the game Blackjack

type BlackjackGame struct {
	Deck       card.Deck
	Config     *BlackjackConfig
	IsRunning  bool
	PlayerHand []card.Card
	DealerHand []card.Card
}

type BlackjackConfig struct {
	DealerStandsOn int
	BlackjackValue int
}

type BlackjackLib struct {}

// =============== Exposed API ===============

// Returns a BlackjackConfig struct with sensible defaults.
func (g *BlackjackLib) DefaultConfig() *BlackjackConfig {
	return &BlackjackConfig{
		DealerStandsOn: 17,
		BlackjackValue: 21,
	}
}

func (g *BlackjackGame) StartGame() {
	g.IsRunning = true
}

func (g *BlackjackGame) StopGame() {
	g.IsRunning = false
}

func (g *BlackjackLib) NewDefaultGame() *BlackjackGame {
	outGame := BlackjackGame{}

	cl := card.CardLib{}
	bl := BlackjackLib{}

	outGame.Config = bl.DefaultConfig()
	outGame.Deck = cl.NewStandardDeck()
	outGame.IsRunning = false

	return &outGame
}

// Empties the hands of both the player and the dealer
func (g *BlackjackGame) ClearHands() {
	g.DealerHand = nil
	g.PlayerHand = nil
}

// Calculates the numerical value of a set of cards
// acesAsOne = true will give aces the value of 1, rather than 11.
func (g *BlackjackGame) CalculateHandValue(hand []card.Card, acesAsOne bool) int {

	if acesAsOne {
		return int(util.AccumulateSlice(hand, standardCardAccumulator))
	}

	return int(util.AccumulateSlice(hand, aceElevenCardAccumulator))

}

// Returns the highest interpretable value of a hand
func (g *BlackjackGame) CalculateBestHandValue(hand []card.Card) int {
	standardVal := g.CalculateHandValue(hand, true)
	aceElevenVal := g.CalculateHandValue(hand, false)

	if aceElevenVal > g.Config.BlackjackValue {
		return standardVal
	} else {
		return aceElevenVal
	}
}

// =============== Misc & Other Util ===============

// Counts JQK as 10, Ace as 1
func standardCardAccumulator(currentVal int, c *card.Card) int {
	if c.Value > 10 {
		return currentVal + 10
	} else {
		return currentVal + c.Value
	}
}

// Counts JQK as 10, Ace as 11
func aceElevenCardAccumulator(currentVal int, c *card.Card) int {
	if c.Value > 10 {
		return currentVal + 10
	} else if c.Value == 1 {
		return currentVal + 11
	} else {
		return currentVal + c.Value
	}
}
