package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/weldeondotwav/wails-blackjack/internal/card"
	"github.com/weldeondotwav/wails-blackjack/internal/game/blackjack"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	cardLib := card.NewCardLib()

	blackJack := &blackjack.BlackjackGame{}
	blackJackLib := &blackjack.BlackjackLib{}
	blackJackCfg := &blackjack.BlackjackConfig{}

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "go-cards",
		Width:            1100,
		MinWidth:         550,
		Height:           800,
		MinHeight:        650,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 36, G: 36, B: 36, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			cardLib,
			blackJack,
			blackJackLib,
			blackJackCfg,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
