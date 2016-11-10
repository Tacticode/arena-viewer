/**
 * Tacticode - Custom Texture
 */
 
/* animations:
 *	stand
 *	attack
 *
 * directions:
 *	nw, ne, se, sw
 *
 * textures :
 *	0:sw
 *	1:se
 *	2:nw
 *	3:ne
 *	4:attack sw
 *	5:attack se
 *	6:attack nw
 *	7:attack ne
 */

"use strict"

/**
 * Creates a new CustomTexture
 * @constructor
 * @param width Width of the texture in pixels
 * @param height Height of the texture in pixels
 */
Tacticode.CustomTexture = function(width = Tacticode.CustomTexture.DEFAULT_WIDTH,
		height = Tacticode.CustomTexture.DEFAULT_HEIGHT){
	this.width = width;
	this.height = height;
	this.textures = [];
	this.container = new PIXI.Container();
}

Tacticode.CustomTexture.DEFAULT_WIDTH = 64;
Tacticode.CustomTexture.DEFAULT_HEIGHT = 64;

/**
 * Add an image to the custom texture
 * @param texture Image added to the texture
 * @param tint Value of the texture tint
 * @param scale Size of the image
 * @param mirrored The image is mirrored horizontaly if true
 * @param x horizontal position of the image
 * @param y vertical position of the image
 * @return the custom texture
 */
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

/**
 * Add a part to the custom texture
 * @param part EntityPart added to the texture
 * @param frame of the animation the part is added
 * @param tint Value of the texture tint
 * @return the custom texture
 */
Tacticode.CustomTexture.prototype.addPart = function(part, frame, tint = 0xFFFFFF){
	var animation = Math.floor(frame / 4);
	var direction = frame % 4;
	var animationNames = ["stand", "attack"];
	var directionNames = ["sw", "se", "nw", "ne"];
	var file = Tacticode.ASSETS_PATH + part.path;
	var mirrored = false;
	var types = Tacticode.CustomTexture.EntityPart.types;
	
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

/**
 * Generate the custom texture
 * @param callback Function called with the texture as parameter after the generation
 */
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

/**
 * Clear the custom texture
 * @param destroyTextures destroy all loaded textures
 */
Tacticode.CustomTexture.prototype.clear = function(destroyTextures = false){
	this.container.removeChildren();
	if (destroyTextures)
		for (texture of this.textures)
			texture.destroy();
	this.textures = [];
}

/**
 * Destroy the custom texture
 * @param destroyTextures destroy all loaded textures
 */
Tacticode.CustomTexture.prototype.destroy = function(destroyTextures = false){
	this.container.destroy(true);
	if (destroyTextures)
		for (texture of this.textures)
			texture.destroy();
}

/**
 * Get a random color of the format 0xRRGGBB
 * @return the random color
 */
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

/**
 * generate textures for an entity
 * @param entity Character the textures will be based on
 * @param callback Function called after the generation, take the texture array as a parameter
 */
Tacticode.CustomTexture.entityTexture = function(entity, callback = None){
	var textures = [];
	var selection = Tacticode.CustomTexture.randomSelection;
	var breedData;
	
	if (entity.breed == Tacticode.Entity.Breed.Orc)
		breedData = Tacticode.CustomTexture.EntityPart.breedData.orc;
	else
		breedData = Tacticode.CustomTexture.EntityPart.breedData.human;
	
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
	var weapon = Tacticode.CustomTexture.EntityPart.parts[entity.weapon];
	
	var generateFrames = function(frame, next){
		if (frame < 8){
			var tmp = new Tacticode.CustomTexture()
				.addPart(body, frame, skinColor)
				.addPart(eyes, frame, eyesColor)
				.addPart(face, frame)
				.addPart(hair, frame, hairColor);
			for (var c of clothes)
				tmp.addPart(c.t, frame, c.c);
			if (armor)
				tmp.addPart(armor, frame, armorColor);
			tmp.addPart(boots, frame, bootColor)
				.addPart(weapon, frame)
				//.addPart(parts.hat1, frame)
				tmp.generate(function(texture){
					textures[frame] = texture;
					next(frame + 1, next)
				});
		}
		else if (entity && callback)
			callback(textures);
	};
	generateFrames(0, generateFrames);
}
