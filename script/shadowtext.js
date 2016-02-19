/**
 * Tacticode - Shadow Text
 */

Tacticode.ShadowText = function (x, y, font, color, shadowColor) {
    this.container = new PIXI.Container();
	this._text = new PIXI.Text('',{font : font, fill : color});
	this._text.x = x;
	this._text.y = y;
	this._shadow = new PIXI.Text('',{font : font, fill : shadowColor});
	this._shadow.x = x + 2;
	this._shadow.y = y + 2;
	this.container.addChild(this._shadow);
	this.container.addChild(this._text);
};

Tacticode.ShadowText.prototype.setText = function (text) {
	this._text.text = text;
	this._shadow.text = text;
};
