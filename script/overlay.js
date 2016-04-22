/**
 * Tacticode - Overlay
 */

"use strict";

Tacticode.OverlayManager = function (stage) {
	this.container = new PIXI.Container();
	this.overlays = [];
	
	stage.addChild(this.container);
};

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

Tacticode.OverlayManager.prototype.addDamage = function (x, y, health) {
	x += Tacticode.GAME_WIDTH / 2;
	y += Tacticode.GAME_HEIGHT / 4 - Tacticode.CELL_HEIGHT_HALF * 2;
	var overlay = new Tacticode.TextOverlay(this.container, x, y, 0xF00000, "-" + health)
	this.overlays.push(overlay);
};

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

Tacticode.TextOverlay.prototype.destroy = function () {
	this.container.removeChild(this.text);
};

Tacticode.TextOverlay.prototype.update = function () {
	this.age += 1;

	this.text.y -= 2;
	this.scale -= 0.0005 * this.age;
	this.text.scale.set(this.scale, this.scale);
};

Tacticode.TextOverlay.prototype.isAlive = function () {
	return this.age <= this.lifespan;
};

