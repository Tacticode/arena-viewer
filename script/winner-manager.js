/**
 * Tacticode - Winner Manager
 */

"use strict";

Tacticode.WinnerManager = function (stage) {
	this.textWinner = new PIXI.Text('', {
		font : '34px Helvetica',
		fill : 0xf2f2f2
	});
	stage.addChild(this.textWinner);
};

Tacticode.WinnerManager.prototype.setWinner = function (winner) {
	if (winner === null) {
		this.textWinner.text = '';
	} else {
		this.textWinner.text = 'WINNER: ' + winner;
		this.textWinner.x = 512 - this.textWinner.width / 2;
		this.textWinner.y = 384 - this.textWinner.height / 2;
	}
};
