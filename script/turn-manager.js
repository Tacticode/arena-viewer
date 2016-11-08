/**
 * Tacticode - Turn Manager
 */

"use strict";

/**
 * Creates a new TurnManager, used to display the current turn.
 * @constructor
 * @param stage Pixi.js stage where the turn will be displayed.
 */
Tacticode.TurnManager = function (stage) {
	this.turnText = new PIXI.Text('TURN 1', {
		font : '24px Helvetica',
		fill : 0x080808
	});
	this.turnText.x = 512 - this.turnText.width / 2;
	this.turnText.y = 20;
	stage.addChild(this.turnText);
	this._currentFontWidth = 24;
	this._currentTurn = 1;
};

/**
 * Set the turn displayed on top of the screen. Animate if required.
 * @param {number} turn Current turn.
 * @param {boolean} animate True if the change should be animated, false otherwise.
 */
Tacticode.TurnManager.prototype.setTurn = function (turn, animate) {
	this.turnText.text = 'TURN ' + turn;
	this._currentTurn = turn;
	if (animate) {
		this._currentFontWidth = 48;
		this.turnText.style.font = this._currentFontWidth + 'px Helvetica';
		this.turnText.dirty = true;
		this.turnText.x = 512 - this.turnText.width / 2;
		this.turnText.y = 48 - this.turnText.height / 2;
	}
};

/**
 * Animate the text when the turn was changed. Must be called once per frame.
 */
Tacticode.TurnManager.prototype.update = function () {
	if (this._currentFontWidth > 24) {
		this._currentFontWidth -= 1 * Tacticode.speed;
		this.turnText.style.font = this._currentFontWidth + 'px Helvetica';
		this.turnText.dirty = true;
		this.turnText.x = 512 - this.turnText.width / 2;
		this.turnText.y = 48 - this.turnText.height / 2;
	}
};
