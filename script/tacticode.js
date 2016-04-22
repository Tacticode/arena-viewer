/**
 * Tacticode - Main file
 */

/**
 * Static variables and constants
 */
var Tacticode = {
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 768,
    CELL_WIDTH_HALF: 32,
    CELL_HEIGHT_HALF: 16
};

/**
 * Initializes the tacticode viewer.
 * Creates all the graphical elements and starts the battle.
 */
Tacticode.init = function (parent) {
	Tacticode.stage = new PIXI.Container();
	Tacticode.renderer = new PIXI.autoDetectRenderer(Tacticode.GAME_WIDTH, Tacticode.GAME_HEIGHT);
	Tacticode.projectiles = new Tacticode.ProjectilesAnimator(Tacticode.stage);
	Tacticode.entities = new Tacticode.EntityAnimator(Tacticode.stage);
	
	Tacticode.coordinatesText = new PIXI.Text('', {font: '20px Arial', fill: 0xEEEEEE, dropShadow: true, dropShadowColor: 0x000000, dropShadowDistance: 2});
	Tacticode.coordinatesText.x = 8;
	Tacticode.coordinatesText.y = 8;
	
	Tacticode.stage.addChild(Tacticode.coordinatesText);
	document.getElementById(parent).appendChild(Tacticode.renderer.view);

    requestAnimationFrame(Tacticode._animate);
};

/**
 * Play the requested fight by loading the correct map, the entities
 * and playing every animation step by step.
 */
Tacticode.loadFight = function (data) {
	Tacticode.Fight.play(data);
};

/**
 * Load and display the specified map and call the callback upon success.
 */
Tacticode.loadMap = function (mapName, callback) {
	Tacticode.map = new Tacticode.Map();
	Tacticode.map.loadFromName(mapName, function () {
		Tacticode.stage.addChildAt(Tacticode.map.container, 0);
		callback();
	});
	Tacticode.map.onCellSelected = function (cell) {
		if (cell) {
			Tacticode.coordinatesText.text = ('cell: (' + cell.x + ',' + cell.y + ') height: ' + cell.z + '\naccessible: ' + cell.accessible + '\nline-of-sight: ' + cell.los);
		} else {
			Tacticode.coordinatesText.text = ('');
		}
	};
};

/**
 * Updates the game state. This function called once per frame.
 */
Tacticode.update = function () {
	Tacticode.projectiles.animate();
	if (Tacticode.animateFight) {
		Tacticode.animateFight.next();
	}
};

/**
 * Requests another animation frame, updates the game state then displays the stage.
 * @private
 */
Tacticode._animate = function () {
    requestAnimationFrame(Tacticode._animate);
	Tacticode.update();
    Tacticode.renderer.render(Tacticode.stage);
};