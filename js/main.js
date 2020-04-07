var stage = new createjs.Stage('game');
var GRID = 10;

// Title
var title = stage.addChild(new createjs.Text("MEMORY", "Bold 20px Arial", "white"));
title.textAlign = "center";
title.textBaseline = "middle";
title.x = stage.canvas.width/2;
title.y = 100;

// Game screen
var screen = stage.addChild(new createjs.Container());
screen.x = 50;
screen.y = 200;

// Background
var bg = screen.addChild(new createjs.Shape());
bg.graphics
	.beginStroke('rgba(255, 255, 255, 1)').setStrokeStyle(2)
	.beginFill('rgba(0, 0, 0, 1)').drawRect(0, 0, 400, 400);
	
// Faces
var faces = screen.addChild(new createjs.Container());
faces.x = 110;
faces.y = 200;

// Controls
var guide = stage.addChild(new createjs.Text("Tap to show", "Bold 20px Arial", "white"));
guide.textAlign = "center";
guide.textBaseline = "middle";
guide.x = stage.canvas.width/2;
guide.y = 300;

// Numbers
var numbers = [
	{ 
		id: 1,
		cells: [
			0, 0, 0, 1,
			0, 0, 1, 1,
			0, 1, 0, 1,
			0, 0, 0, 1,
			0, 0, 0, 1,
		]
	},
	{ 
		id: 2,
		cells: [
			0, 1, 1, 1,
			1, 0, 0, 1,
			0, 0, 1, 0,
			0, 1, 0, 0,
			1, 1, 1, 1,
		]
	},
	{ 
		id: 3,
		cells: [
			0, 1, 1, 0,
			1, 0, 0, 1,
			0, 0, 1, 0,
			1, 0, 0, 1,
			0, 1, 1, 0,
		]
	},
	{ 
		id: 4,
		cells: [
			0, 0, 1, 1,
			0, 1, 0, 1,
			1, 1, 1, 1,
			0, 0, 0, 1,
			0, 0, 0, 1,
		]
	},
	{ 
		id: 5,
		cells: [
			1, 1, 1, 1,
			1, 1, 1, 0,
			0, 0, 0, 1,
			1, 0, 0, 1,
			0, 1, 1, 0,
		]
	},
	{ 
		id: 6,
		cells: [
			0, 0, 1, 0,
			0, 1, 0, 0,
			1, 1, 1, 0,
			1, 0, 0, 1,
			0, 1, 1, 0,
		]
	},
	{ 
		id: 7,
		cells: [
			1, 1, 1, 1,
			0, 0, 0, 1,
			0, 0, 1, 0,
			0, 1, 0, 0,
			1, 0, 0, 0,
		]
	},
	{ 
		id: 8,
		cells: [
			0, 1, 1, 0,
			1, 0, 0, 1,
			0, 1, 1, 0,
			1, 0, 0, 1,
			0, 1, 1, 0,
		]
	},
	{ 
		id: 9,
		cells: [
			0, 1, 1, 0,
			1, 0, 0, 1,
			0, 1, 1, 1,
			0, 0, 1, 0,
			0, 1, 0, 0,
		]
	},
];

// Game
var game = {
	boxes: 4,
	pattern : [], // List of numbers
	checkingResult : false, // Flag for checking rsult
	// Creates pattern
	create: () => {
		while(game.pattern.length < game.boxes) {
			var n = Math.floor(Math.random() * 9) + 1;
			if(!game.pattern.includes(n)) { // Prevents duplicate
				game.pattern.push(n);
			}
		}
		
		// Duplicate pattern
		game.pattern = game.pattern.concat(game.pattern);
		
		game.shuffle();
		game.draw();
	},
	// Shuffle pattern
	shuffle: () => {
		for(var i = game.pattern.length-1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i+1));
			// Change index position
			[game.pattern[i], game.pattern[j]] = [game.pattern[j], game.pattern[i]];
		}
	},
	// Draw
	boxList : [], // Array container for faces
	draw: () => {
		var index = 0;
		for(var y = 0; y < game.boxes/2; y++) {
			for(var x = 0; x < game.boxes; x++) {
				var face = new Face(x * (GRID * 4), y * (GRID * 5), index++);
				game.boxList.push(face);
				faces.addChild(face.body);
			}
		}
	},
	// Check result
	checkResult() {
		if(game.checkingResult) return;
		// Get all selected boxes that are not yet guessed successfully
		var selected = game.boxList.filter(e => e.selected && !e.guessed);
		// If selected box is 2, check result
		if(selected.length === 2) {
			game.checkingResult = true;
			if(selected[0].value === selected[1].value) {
				setTimeout(() => {
					selected[0].correct();
					selected[1].correct();
					
					game.checkingResult = false;
				}, 500);
			} else {
				setTimeout(() => {
					selected[0].reset();
					selected[1].reset();
					
					game.checkingResult = false;
				}, 500);
			}
		}
	}
};

class Face {
	constructor(x, y, index) {
		this.selected = false; // Selected flag
		this.guessed = false; // Guessed flag
		this.value = game.pattern[index]; // Face value
		
		this.body = new createjs.Container();
		this.body.x = x + ((index < game.boxes) ? 20*index:(20*index)-20*game.boxes);
		this.body.y = y + ((index < game.boxes) ? 0:20);
		
		this.bg = this.body.addChild(new createjs.Shape());
		this.bg.graphics
			.beginStroke('rgba(0, 0, 0, 1)').setStrokeStyle(1)
			.beginFill('rgba(255, 255, 255, 0.8)').drawRect(0, 0, GRID * 4, GRID * 5)
		this.bg.regX = this.bg.graphics.command.w/2;
		this.bg.regY = this.bg.graphics.command.h/2;
			
		this.display = this.body.addChild(new createjs.Shape());
		this.display.regX = this.bg.graphics.command.w/2;
		this.display.regY = this.bg.graphics.command.h/2;
		// Get value
		var number = numbers.find(e => e.id === this.value);
		// Create value
		for(var y = 0; y < 5; y++) {
			for(var x = 0; x < 4; x++) {
				var fill = number.cells[((y * 4)+x)] === 1 ? 'rgba(255, 255, 255, 1)':'rgba(0, 0, 0, 0.8)';
				this.display.graphics
					.beginStroke('rgba(0, 0, 0, 1)').setStrokeStyle(1)
					.beginFill(fill).drawRect(x * GRID, y * GRID, GRID, GRID)
			}
		}
		this.display.scaleX = 0;
		
		// Open box
		this.body.on('click', () => {
			if(this.selected || game.checkingResult) return;
			this.selected = true;
			this.display.scaleX = 1;
			
			game.checkResult();
		})
	}
	/*
	 * Change guessed state
	 */
	correct() {
		this.guessed = true;
		this.display.alpha = 0.5;
	}
	/*
	 * Reset state
	 */
	reset() {
		this.selected = false;
		this.display.scaleX = 0;
	}
}

// Update game
function update() {
	stage.update();
}

function restart() {
	game.create();
}
setTimeout(() => { restart(); }, 0);

createjs.Ticker.on('tick', update);