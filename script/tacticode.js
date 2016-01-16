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
	Tacticode.projectiles = new ProjectilesAnimator(Tacticode.stage);
	document.body.appendChild(Tacticode.renderer.view);

    requestAnimationFrame(Tacticode.animate);
};

Tacticode.animate = function () {
    requestAnimationFrame(Tacticode.animate);
	Tacticode.update();
    Tacticode.renderer.render(Tacticode.stage);
};

/**
 * Function called once per frame.
 */
Tacticode.update = function () {
	Tacticode.projectiles.animate();
};
