/**
 * Tacticode - Cell Information
 */

"use strict";

/**
 * Creates a new PIXI.js text that will contain information about a cell
 * and adds it to the specified stage.
 */
Tacticode.CellInformation = function (stage) {
	this.text = new PIXI.Text('', {
		font : '16px Helvetica',
		fill : 0x080808
	});
	this.text.x = 8;
	this.text.y = 8;
	stage.addChild(this.text);
};

/**
 * Updates the displayed text with the specified cell information.
 */
Tacticode.CellInformation.prototype.update = function (cell) {
	if (cell) {
		var entity = Tacticode.entities.getEntityOnCell(cell.x, cell.y, cell.z + 1);
		var text =
			'cell: (' + cell.x + ',' + cell.y + ')\nheight: ' + cell.z + '\n' +
			'accessible: ' + cell.accessible + '\n' +
			'line-of-sight: ' + cell.los;
		if (entity !== null) {
			text += '\n\n';
			text += 'id: ' + entity.id + '\nhealth: ' + entity.health;
		}
		this.text.text = text;
	} else {
		this.text.text = '';
	}
}
