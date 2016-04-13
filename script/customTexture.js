/*
default frame size: 64x64 pixels

frames:
	stand
	throw (object/spell)
	shoot (bow)
	attack (sword)

directions:
	nw, ne, se, sw
*/

Tacticode.CustomTexture = function(width = 64, height = 64){
	this.width = width;
	this.height = height;
	this.textures = [];
	this.container = new PIXI.Container();
}

Tacticode.CustomTexture.prototype.add = function(texture, tint = 0xFFFFFF, scale = 1, x = 0, y = 0){
	this.textures.push(texture);
	var sprite = new PIXI.Sprite(texture);
	sprite.tint = tint;
	sprite.scale.x = sprite.scale.y = scale;
	sprite.x = x;
	sprite.y = y;
	this.container.addChild(sprite);
	return this;
}

Tacticode.CustomTexture.prototype.generate = function(callback){
	var renderer = new PIXI.CanvasRenderer(this.width, this.height);
	renderer.transparent = true;
	var container = this.container;
	var toLoad = 1;
	var load = function(){
		if (--toLoad == 0)
			callback(container.generateTexture(renderer, 1, PIXI.SCALE_MODES.LINEAR));
	}
	
	for (var texture of this.textures){
		var base = texture.baseTexture;
		if (!base.hasLoaded){
			++toLoad;
			base.on("loaded", load);
		}
	}
	
	load();
}

Tacticode.CustomTexture.prototype.clear = function(destroyTextures = false){
	this.container.removeChildren();
	if (destroyTextures)
		for (texture of this.textures)
			texture.destroy();
	this.textures = [];
}

Tacticode.CustomTexture.prototype.destroy = function(destroyTextures = false){
	this.container.destroy(true);
	if (destroyTextures)
		for (texture of this.textures)
			texture.destroy();
}

var test = new Tacticode.CustomTexture();
test.add(PIXI.Texture.fromImage("assets/sprites/character/body/body1_attack_nw.png"), 0x3bbf40, 2/3);
test.add(PIXI.Texture.fromImage("assets/sprites/character/equipment/hat.png"), 0xFFFFFF, 2/3);
test.generate(function(texture){
	console.log("texture generated");
	console.log(texture);
	Tacticode.stage.addChild(new PIXI.Sprite(texture));
	//test.destroy();
});
