/**
 * Tacticode - Turn Manager
 */

"use strict";

Tacticode.TurnManager = function (stage) {
	this.turnText = new PIXI.Text('Turn 1', {
		font : '24px Helvetica',
		fill : 0x080808
	});
	this.turnText.x = 512 - this.turnText.width / 2;
	this.turnText.y = 20;
	stage.addChild(this.turnText);
	this._currentFontWidth = 24;
	this._currentTurn = 1;
};

Tacticode.TurnManager.prototype.setTurn = function (turn, animate) {
	this.turnText.text = 'Turn ' + turn;
	this._currentTurn = turn;
	if (animate) {
		this._currentFontWidth = 48;
		this.turnText.style.font = this._currentFontWidth + 'px Helvetica';
		this.turnText.dirty = true;
		this.turnText.x = 512 - this.turnText.width / 2;
		this.turnText.y = 48 - this.turnText.height / 2;
	}
};

Tacticode.TurnManager.prototype.update = function () {
	if (this._currentFontWidth > 24) {
		this._currentFontWidth -= 1 * Tacticode.speed;
		this.turnText.style.font = this._currentFontWidth + 'px Helvetica';
		this.turnText.dirty = true;
		this.turnText.x = 512 - this.turnText.width / 2;
		this.turnText.y = 48 - this.turnText.height / 2;
	}
};
