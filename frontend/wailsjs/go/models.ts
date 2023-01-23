export namespace blackjack {
	
	export class BlackjackConfig {
	    dealer_stands_on?: number;
	    blackjack_value?: number;
	
	    static createFrom(source: any = {}) {
	        return new BlackjackConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dealer_stands_on = source["dealer_stands_on"];
	        this.blackjack_value = source["blackjack_value"];
	    }
	}
	export class BlackjackGame {
	    deck?: card.Deck;
	    config?: BlackjackConfig;
	    is_running?: boolean;
	    player_hand?: card.Card[];
	    dealer_hand?: card.Card[];
	
	    static createFrom(source: any = {}) {
	        return new BlackjackGame(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.deck = this.convertValues(source["deck"], card.Deck);
	        this.config = this.convertValues(source["config"], BlackjackConfig);
	        this.is_running = source["is_running"];
	        this.player_hand = this.convertValues(source["player_hand"], card.Card);
	        this.dealer_hand = this.convertValues(source["dealer_hand"], card.Card);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace card {
	
	export class Card {
	    value?: number;
	    suit?: number;
	    is_red?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Card(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.value = source["value"];
	        this.suit = source["suit"];
	        this.is_red = source["is_red"];
	    }
	}
	export class Deck {
	    cards?: Card[];
	
	    static createFrom(source: any = {}) {
	        return new Deck(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cards = this.convertValues(source["cards"], Card);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

