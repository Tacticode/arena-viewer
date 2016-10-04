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
	Tacticode.cellInformation = new Tacticode.CellInformation(Tacticode.stage);
	Tacticode.overlayManager = new Tacticode.OverlayManager(Tacticode.stage);
	Tacticode.turnManager = new Tacticode.TurnManager(Tacticode.stage);
	Tacticode.sound = new SoundManager(Tacticode.ASSETS_PATH + 'sound/');
	Tacticode.sound.register('swing', 'swing.wav', 2);
	Tacticode.sound.register('impact', 'impactWood.ogg', 2);
	Tacticode._createVolumeButtons();
	Tacticode.speed = 1;

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
Tacticode.loadMap = function (mapData, callback) {
	Tacticode.map = new Tacticode.Map();
	Tacticode.map.loadFromData(mapData, function () {
		Tacticode.stage.addChildAt(Tacticode.map.container, 0);
		callback();
	});
	Tacticode.map.onCellSelected = function (cell) {
		Tacticode.cellInformation.update(cell);
	};
};

/**
 * Updates the game state. This function called once per frame.
 */
Tacticode.update = function () {
	Tacticode.projectiles.animate();
	Tacticode.overlayManager.update();
	Tacticode.turnManager.update();
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

/**
 * Creates the on/off volume buttons and handles their events.
 * @private
 */
Tacticode._createVolumeButtons = function () {
	var volumeOnTexture = PIXI.Texture.fromImage(Tacticode.ASSETS_PATH + 'sprites/buttons/volume-on.png');
	Tacticode.volumeOnButton = new PIXI.Sprite(volumeOnTexture);
	Tacticode.volumeOnButton.buttonMode = true;
	Tacticode.volumeOnButton.interactive = true;
	Tacticode.volumeOnButton.x = Tacticode.GAME_WIDTH - 48;
	Tacticode.volumeOnButton.y = 16;
	Tacticode.stage.addChild(Tacticode.volumeOnButton);
	Tacticode.volumeOnButton.on('mousedown', function () {
		Tacticode.sound.isMuted = true;
		Tacticode.stage.removeChild(Tacticode.volumeOnButton);
		Tacticode.stage.addChild(Tacticode.volumeOffButton);
	});
	
	var volumeOffTexture = PIXI.Texture.fromImage(Tacticode.ASSETS_PATH + 'sprites/buttons/volume-off.png');
	Tacticode.volumeOffButton = new PIXI.Sprite(volumeOffTexture);
	Tacticode.volumeOffButton.buttonMode = true;
	Tacticode.volumeOffButton.interactive = true;
	Tacticode.volumeOffButton.x = Tacticode.GAME_WIDTH - 48;
	Tacticode.volumeOffButton.y = 16;
	Tacticode.volumeOffButton.on('mousedown', function () {
		Tacticode.sound.isMuted = false;
		Tacticode.stage.removeChild(Tacticode.volumeOffButton);
		Tacticode.stage.addChild(Tacticode.volumeOnButton);
	});
};