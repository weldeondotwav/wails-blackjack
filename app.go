package main

import (
	"context"

	_ "github.com/weldeondotwav/wails-blackjack/internal/card"
	_ "github.com/weldeondotwav/wails-blackjack/internal/game/blackjack"

	"github.com/wailsapp/wails/v2/pkg/runtime"
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
	runtime.LogPrint(ctx, "Application started")
}
