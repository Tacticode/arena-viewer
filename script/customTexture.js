/**
 * Tacticode - Custom Texture
 */

"use strict"

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

Tacticode.CustomTexture.randomColor = function(){
	return Math.floor(Math.random() * 0x1000000);
}

Tacticode.CustomTexture.randomSelection = function(data){
	if (typeof(data) == "function")
		return data();
	if (data.constructor === Array)
		return data[Math.floor(Math.random() * data.length)];
	return data;
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
	
	let parts = Tacticode.CustomTexture.CharacterPart.parts;
	
	Tacticode.CustomTexture.CharacterPart.breedData = {
		orc: {
			body: parts.body1,
			eyes: parts.eyes1,
			hair: [parts.hair1, parts.hair2, parts.hair3],
			clothes: [[parts.clothes1, parts.clothes2],
				[parts.clothes1]],
			clothesColors: Tacticode.CustomTexture.randomColor,
			armor: [parts.armor1, parts.armor2, null],
			armorColors: [0xb0a090, 0x606050, 0x806000, 0xffd700],
			boots: parts.boots1,
			bootColors: [0x704010, 0x403030, 0x908080],
			skinColors: [0x20d030, 0x209020, 0x70b020, 0x3090d0],
			hairColors: [0xc7c7c7, 0x666666, 0x040201, 0x4c200a, 0x892f1a, 0x895e1a, 0xe5c11f],
			eyesColors: [0xf31a12, 0x500502],
			face: parts.face2
		},
		human: {
			body: parts.body1,
			eyes: parts.eyes1,
			hair: [parts.hair1, parts.hair2, parts.hair3],
			clothes: [[parts.clothes1, parts.clothes2]],
			clothesColors: Tacticode.CustomTexture.randomColor,
			armor: [parts.armor1, parts.armor2],
			armorColors: [0xb0a090, 0x606050, 0x806000, 0xffd700],
			boots: parts.boots1,
			bootColors: [0x704010, 0x403030, 0x908080],
			skinColors: [0xf0e0b0, 0xf0e0c0, 0xf8e887, 0xaa7a08, 0x6a4c06, 0xd7d379],
			hairColors: [0xc7c7c7, 0x666666, 0x040201, 0x4c200a, 0x892f1a, 0x895e1a, 0xe5c11f],
			eyesColors: [0x135ca0, 0x22dd62, 0x7e4220],
			face: parts.face1
		}
	}
	// http://www.color-hex.com/color-wheel/
}

Tacticode.CustomTexture.entityTexture = function(entity, callback = None){
	var textures = [];
	var selection = Tacticode.CustomTexture.randomSelection;
	var breedData;
	
	if (entity.breed == Tacticode.Entity.Breed.Orc)
		breedData = Tacticode.CustomTexture.CharacterPart.breedData.orc;
	else
		breedData = Tacticode.CustomTexture.CharacterPart.breedData.human;
	
	var body = selection(breedData.body);
	var eyes = selection(breedData.eyes);
	var hair = selection(breedData.hair);
	var clothesTypes = selection(breedData.clothes)
	var clothes = []
	for (var t of clothesTypes)
		clothes.push({t: t,
			c: selection(breedData.clothesColors)})
	var armor = selection(breedData.armor);
	var armorColor = selection(breedData.armorColors);
	var boots = selection(breedData.boots);
	var bootColor = selection(breedData.bootColors);
	var skinColor = selection(breedData.skinColors);
	var hairColor = selection(breedData.hairColors);
	var eyesColor = selection(breedData.eyesColors);
	var face = selection(breedData.face);
	var weapon = Tacticode.CustomTexture.CharacterPart.parts[entity.weapon];
	
	var f = 0;
	var gen1 = function(gen2){
		//console.log("gen1");
		var tmp = new Tacticode.CustomTexture()
			.addPart(body, f, skinColor)
			.addPart(eyes, f, eyesColor)
			.addPart(face, f)
			.addPart(hair, f, hairColor);
		for (var c of clothes)
			tmp.addPart(c.t, f, c.c);
		if (armor)
			tmp.addPart(armor, f, armorColor);
		tmp.addPart(boots, f, bootColor)
			.addPart(weapon, f)
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