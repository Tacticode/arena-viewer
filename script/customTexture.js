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

Tacticode.CustomTexture = function(width = 64, height = 64, frame = null){
	this.width = width;
	this.height = height;
	this.frame = frame;
	this.textures = [];
	this.container = new PIXI.Container();
}

Tacticode.CustomTexture.prototype.add = function(texture, tint = 0xFFFFFF, scale = 1, mirrored = false, x = 0, y = 0){
	this.textures.push(texture);
	var sprite = new PIXI.Sprite(texture);
	sprite.tint = tint;
	sprite.scale.x = sprite.scale.y = scale;
	if (mirrored)
		sprite.scale.x = -sprite.scale.x;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	sprite.x = x + this.width / 2;
	sprite.y = y + this .height / 2;
	this.container.addChild(sprite);
	return this;
}

Tacticode.CustomTexture.prototype.addPart = function(part, frame, tint = 0xFFFFFF){
	var animation = Math.floor(frame / 4);
	var direction = frame % 4;
	var animationNames = ["stand", "attack"];
	var directionNames = ["sw", "se", "nw", "ne"];
	var file = part.path;
	var mirrored = false;
	
	if (part.type & Tacticode.CustomTexture.CharacterPart.type.FRONT_ONLY && direction > 1)
		return this;
	if (part.type & Tacticode.CustomTexture.CharacterPart.type.BACK_ONLY && direction < 2)
		return this;
	if (part.type & Tacticode.CustomTexture.CharacterPart.type.IS_MIRRORED
		&& (direction == 1 || direction == 3)){
			mirrored = true;
			direction -= 1;
		}
	if (!(part.type & Tacticode.CustomTexture.CharacterPart.type.SINGLE_IMAGE)){
		if (!(part.type & Tacticode.CustomTexture.CharacterPart.type.NO_ANIM))
			file += "_" + animationNames[animation];
		file += "_" + directionNames[direction];
	}
	file += ".png";
	// console.log(file);
	return this.add(PIXI.Texture.fromImage(file), tint, part.scale, mirrored);
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

Tacticode.CustomTexture.CharacterPart = function(path, type, scale = 3/4){
	this.path = path;
	this.type = type;
	this.scale = scale;
}

Tacticode.CustomTexture.CharacterPart.type = {
	IS_MIRRORED: 1, // nw and sw images are mirrored to make the ne and se images
	SINGLE_IMAGE: 2, // all directions and animations are made from 1 image
	FRONT_ONLY: 4, // visible only when the character is looking s
	BACK_ONLY: 8, // visible only when the character is looking n
	NO_ANIM: 16
}

Tacticode.CustomTexture.CharacterPart.parts = {
	body1: new Tacticode.CustomTexture.CharacterPart("assets/sprites/character/body/body1",
		Tacticode.CustomTexture.CharacterPart.type.IS_MIRRORED),
	armor1: new Tacticode.CustomTexture.CharacterPart("assets/sprites/character/equipment/armor1",
		Tacticode.CustomTexture.CharacterPart.type.IS_MIRRORED
		| Tacticode.CustomTexture.CharacterPart.type.NO_ANIM),
	hat1: new Tacticode.CustomTexture.CharacterPart("assets/sprites/character/equipment/hat1",
		Tacticode.CustomTexture.CharacterPart.type.SINGLE_IMAGE)/*,
	sword1: new Tacticode.CustomTexture.CharacterPart("assets/sprites/character/equipment/sword1",
		Tacticode.CustomTexture.CharacterPart.type.IS_MIRRORED)*/
}

Tacticode.CustomTexture.test = function(entity){
	var textures = [];
	var colors = [0x3bbf40, 0xf8e887, 0xaa7a08, 0x6a4c06, 0x908b7f, 0xd7d379, 0x5eabe4];
	var skin = colors[Math.floor(Math.random() * colors.length)];
	var armorTint =  Math.floor((Math.random() * 0xFFFFFF));
	
	var f = 0;
	var gen = function(texture){
		textures[f] = texture;
		/*var sprite = new PIXI.Sprite(texture);
		Tacticode.stage.addChild(sprite);
		sprite.x += 100 * f;*/
		// console.log("frame " + f + " loaded");
		if (f++ < 7){
			var tex = new Tacticode.CustomTexture(frame = f)
			.addPart(Tacticode.CustomTexture.CharacterPart.parts.body1, f, skin)
			.addPart(Tacticode.CustomTexture.CharacterPart.parts.armor1, f, armorTint)
			.addPart(Tacticode.CustomTexture.CharacterPart.parts.hat1, f)
			.generate(gen);
		}
		else if (entity){
			entity.textures = {
				ul: textures[2],
				ur: textures[3],
				dl: textures[0],
				dr: textures[1]
			};
		}
	}
	
	var tex = new Tacticode.CustomTexture(frame = f)
	.addPart(Tacticode.CustomTexture.CharacterPart.parts.body1, f, skin)
	.addPart(Tacticode.CustomTexture.CharacterPart.parts.armor1, f, armorTint)
	.addPart(Tacticode.CustomTexture.CharacterPart.parts.hat1, f)
	.generate(gen);
}
Tacticode.CustomTexture.test();

/*
var test = new Tacticode.CustomTexture();
test.add(PIXI.Texture.fromImage("assets/sprites/character/body/body1_attack_nw.png"), 0x3bbf40, 2/3);
test.add(PIXI.Texture.fromImage("assets/sprites/character/equipment/hat.png"), 0xFFFFFF, 2/3);
test.generate(function(texture){
	console.log("texture generated");
	console.log(texture);
	Tacticode.stage.addChild(new PIXI.Sprite(texture));
	//test.destroy();
});
*/