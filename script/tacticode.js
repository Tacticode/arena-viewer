/**
 * Tacticode - Main file
 */
 
var Tacticode = {
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 768,
    CELL_WIDTH_HALF: 32,
    CELL_HEIGHT_HALF: 16
};

Tacticode.init = function () {
	Tacticode.stage = new PIXI.Container();
	Tacticode.renderer = new PIXI.autoDetectRenderer(1024, 768);
	Tacticode.projectiles = new Tacticode.ProjectilesAnimator(Tacticode.stage);
	Tacticode.entities = new Tacticode.EntityAnimator(Tacticode.stage);
	Tacticode.demo = Tacticode.Test.demoJSON();
	Tacticode.coordinatesText = new Tacticode.ShadowText(8, 8, '20px Arial', 0xEEEEEE, 0x000000);
	Tacticode.stage.addChild(Tacticode.coordinatesText.container);
	document.body.appendChild(Tacticode.renderer.view);

    requestAnimationFrame(Tacticode.animate);
};

Tacticode.animate = function () {
    requestAnimationFrame(Tacticode.animate);
	Tacticode.update();
    Tacticode.renderer.render(Tacticode.stage);
	Tacticode.demo.next();
};

/**
 * Function called once per frame.
 */
Tacticode.update = function () {
	Tacticode.projectiles.animate();
};
