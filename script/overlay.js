/**
 * Tacticode - Overlay
 */

"use strict";

/**
 * Creates a new OverlayManager, used to display damage and heal values.
 * @constructor
 * @param stage Pixi.js stage where the overlay will be displayed.
 */
Tacticode.OverlayManager = function (stage) {
	this.container = new PIXI.Container();
	this.overlays = [];
	
	stage.addChild(this.container);
};

/**
 * Updates the existing labels, must be called once per frame.
 */
Tacticode.OverlayManager.prototype.update = function () {
	var overlays = this.overlays.slice();
	for (let i = 0; i < overlays.length; ++i) {
		var overlay = overlays[i];
		if (!overlay.isAlive()) {
			overlay.destroy();
			var index = this.overlays.indexOf(overlay);
			if (index != -1) {
				this.overlays.splice(index, 1);
			}
		}
		overlay.update();
	}
};

/**
 * Creates a damage label (red) at the specified location.
 * @param {number} x The X coordinate of the new damage label.
 * @param {number} y The Y coordinate of the new damage label.
 * @param {number} health The value displayed on the label.
 */
Tacticode.OverlayManager.prototype.addDamage = function (x, y, health) {
	x += Tacticode.GAME_WIDTH / 2;
	y += Tacticode.GAME_HEIGHT / 4 - Tacticode.CELL_HEIGHT_HALF * 2;
	var overlay = new Tacticode.TextOverlay(this.container, x, y, 0xF00000, "-" + health)
	this.overlays.push(overlay);
};

/**
 * Creates a healing label (green) at the specified location.
 * @param {number} x The X coordinate of the new healing label.
 * @param {number} y The Y coordinate of the new healing label.
 * @param {number} health The value displayed on the label.
 */
Tacticode.OverlayManager.prototype.addHeal = function (x, y, health) {
	x += Tacticode.GAME_WIDTH / 2;
	y += Tacticode.GAME_HEIGHT / 4 - Tacticode.CELL_HEIGHT_HALF * 2;
	var overlay = new Tacticode.TextOverlay(this.container, x, y, 0x00F000, health)
	this.overlays.push(overlay);
};

/**
 * Creates a new overlay label, displaying the specified text at a specified position.
 * @constructor
 * @param container Pixi.js container to which the text will be added.
 * @param {number} x X coordinate of the new label.
 * @param {number} y Y coordinate of the new label.
 * @param {number} color Color of the new label, as an RGB integer.
 * @param {number} text Content of the new overlay text.
 */
Tacticode.TextOverlay = function (container, x, y, color, text) {
	this.container = container;
	this.text = new PIXI.Text(text, {
		font : 'bold 24px Arial',
		fill : color,
		dropShadow : true,
		dropShadowColor : 0x000000,
		dropShadowDistance : 2
	});
	this.text.x = x;
	this.text.y = y;
	this.text.anchor.set(0.5, 0.5);
	this.age = 0;
	this.lifespan = 60;
	this.scale = 1.0;
	this.container.addChild(this.text);
};

/**
 * Removes this text from the container, destroying it.
 */
Tacticode.TextOverlay.prototype.destroy = function () {
	this.container.removeChild(this.text);
};

/**
 * Moves and rescales the label based on time and speed. Must be called once per frame.
 */
Tacticode.TextOverlay.prototype.update = function () {
	this.age += Tacticode.speed;

	this.text.y -= 2 * Tacticode.speed;
	this.scale -= 0.0005 * this.age;
	this.text.scale.set(this.scale, this.scale);
};

/**
 * @return true if the text should still be displayed, false if it should be destroyed.
 */
Tacticode.TextOverlay.prototype.isAlive = function () {
	return this.age <= this.lifespan;
};

