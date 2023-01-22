# wails-blackjack
![image](https://user-images.githubusercontent.com/50535591/213902680-38d9ec3d-2b8e-48ec-83db-13a461a6f3fb.png)


## About

I wanted to learn about [Wails](https://wails.io), and also decided to sprinkle in some [Tailwind](https://tailwindcss.com/), ended up with this minimal-style blackjack game made with vanilla TS / HTML.

Project started with the [Wails Vanilla-TS template](https://github.com/wailsapp/wails/tree/v2.3.1/v2/pkg/templates/templates/vanilla-ts).

## Run Locally

1. Run `npm install` in the project root directory.
2. Also run `npm install` in the `./frontend` directory
3. Run `npm run dev` in the project root directory. to spin up the live dev environment.
    - This starts a Tailwind watcher to auto-compile `style.css`, and the wails dev server.
## Build Locally

To build a redistributable, production mode package, use `wails build` from the project root directory.
