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
	var file = Tacticode.ASSETS_PATH + part.path;
	var mirrored = false;
	var types = Tacticode.CustomTexture.CharacterPart.types;
	
	if ((part.type & types.FRONT_ONLY && direction > 1)
		|| (part.type & types.BACK_ONLY && direction < 2)
		|| (part.type & types.NO_STAND && animation == 0)
		|| (part.type & types.NO_ATTACK && animation == 1))
		return this;
	if (part.type & types.IS_MIRRORED
		&& (direction == 1 || direction == 3)){
			mirrored = true;
			direction -= 1;
		}
	if (!(part.type & types.SINGLE_IMAGE)){
		if (!(part.type & types.NO_ANIM))
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

{
	Tacticode.CustomTexture.CharacterPart.types = {
		IS_MIRRORED: 1, // nw and sw images are mirrored to make the ne and se images
		SINGLE_IMAGE: 2, // all directions and animations are made from 1 image
		FRONT_ONLY: 4, // visible only when the character is looking s
		BACK_ONLY: 8, // visible only when the character is looking n
		NO_ANIM: 16, // use same image for all animations
		NO_STAND: 32, // part ignored in stand frames
		NO_ATTACK: 64 // part ignored in attack frames
	}
	
	let types = Tacticode.CustomTexture.CharacterPart.types;
	// types.NO_ANIM = types.NO_STAND + types.NO_ATTACK;
	
	Tacticode.CustomTexture.CharacterPart.parts = {
		body1: new Tacticode.CustomTexture.CharacterPart("sprites/character/body/body1",
			types.IS_MIRRORED),
		eyes1: new Tacticode.CustomTexture.CharacterPart("sprites/character/body/eyes1",
			types.IS_MIRRORED | types.SINGLE_IMAGE | types.FRONT_ONLY | types.NO_ANIM),
		face1: new Tacticode.CustomTexture.CharacterPart("sprites/character/body/face1",
			types.IS_MIRRORED | types.SINGLE_IMAGE | types.FRONT_ONLY | types.NO_ANIM),
		face2: new Tacticode.CustomTexture.CharacterPart("sprites/character/body/face2",
			types.IS_MIRRORED | types.SINGLE_IMAGE | types.FRONT_ONLY | types.NO_ANIM),
		hair1: new Tacticode.CustomTexture.CharacterPart("sprites/character/body/hair1",
			types.IS_MIRRORED | types.NO_ANIM),
		hair2: new Tacticode.CustomTexture.CharacterPart("sprites/character/body/hair2",
			types.IS_MIRRORED | types.NO_ANIM),
		hair3: new Tacticode.CustomTexture.CharacterPart("sprites/character/body/hair3",
			types.IS_MIRRORED | types.NO_ANIM),
		clothes1: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/clothes1",
			types.IS_MIRRORED | types.NO_ANIM),
		clothes2: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/clothes2",
			types.IS_MIRRORED | types.NO_ANIM),
		armor1: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/armor1",
			types.IS_MIRRORED | types.NO_ANIM),
		armor2: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/armor2",
			types.IS_MIRRORED | types.NO_ANIM),
		boots1: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/boots1",
			types.IS_MIRRORED | types.NO_ANIM),
		hat1: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/hat1",
			types.SINGLE_IMAGE),
		sword1: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/sword1",
			types.IS_MIRRORED),
		bow1: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/bow1",
			types.IS_MIRRORED),
		staff1: new Tacticode.CustomTexture.CharacterPart("sprites/character/equipment/staff1",
			types.IS_MIRRORED)
	}
}

Tacticode.CustomTexture.entityTexture = function(entity, callback = None){
	var textures = [];
	var skin;
	var parts = Tacticode.CustomTexture.CharacterPart.parts;
	var eyesColor = Math.floor((Math.random() * 0x1000000));
	var hairColor = Math.floor((Math.random() * 0x1000000));
	var armorColors = [0xb0a090, 0x606050, 0x806000, 0xffd700];
	var armorColor =  armorColors[Math.floor(Math.random() * armorColors.length)];
	var bootColors = [0x704010, 0x403030, 0x908080];
	var bootColor = bootColors[Math.floor(Math.random() * bootColors.length)];
	var face;
	var armor = Math.random() < 0.5 ? parts.armor1 : parts.armor2;
	var clothes = [];
	
	if (entity.breed == Tacticode.Entity.Breed.Orc){
		let colors = [0x20d030, 0x209020, 0x70b020, 0x3090d0];
		skin = colors[Math.floor(Math.random() * colors.length)];
		face = parts.face2;
		if (Math.random() < 0.5){
			armor = false;
			clothes.push({t:parts.clothes1, c:Math.floor((Math.random() * 0x1000000))});
			if (Math.random() < 0.5)
				clothes.push({t:parts.clothes2, c:Math.floor((Math.random() * 0x1000000))});
		}
	}
	else{
		let colors = [0xf0e0b0, 0xf0e0c0, 0xf8e887, 0xaa7a08, 0x6a4c06, 0xd7d379];
		skin = colors[Math.floor(Math.random() * colors.length)];
		face = parts.face1;
		if (Math.random() < 0.5)
			clothes.push({t:parts.clothes1, c:Math.floor((Math.random() * 0x1000000))});
	}
	
	var f = 0;
	var gen1 = function(gen2){
		// console.log("gen1");
		var tmp = new Tacticode.CustomTexture(frame = f)
			.addPart(parts.body1, f, skin)
			.addPart(parts.eyes1, f, eyesColor)
			.addPart(face, f)
			.addPart(parts.hair1, f, hairColor);
		for (var c of clothes)
			tmp.addPart(c.t, f, c.c);
		if (armor)
			tmp.addPart(armor, f, armorColor);
		tmp.addPart(parts.boots1, f, bootColor)
			.addPart(parts.sword1, f)
			//.addPart(parts.hat1, f)
			.generate(gen2);
	}
	var gen2 = function(texture){
		// console.log("gen2"+f);
		textures[f] = texture;
		if (f++ < 7)
			gen1(gen2);
		else if (entity && callback)
			callback(textures);
	}
	
	gen1(gen2);
}

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