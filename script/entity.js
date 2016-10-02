/**
 * Tacticode - Entity
 */

"use strict"

 /*
textures:
	0:sw
	1:se
	2:nw
	3:ne
	4:attack sw
	5:attack se
	6:attack nw
	7:attack ne
*/


Tacticode.Entity = function(entity, animator, callback) {
	this.id = entity.id;
	this.x = entity.x;
	this.y = entity.y;
	this.z = Tacticode.map.getCell(this.x, this.y).z + 1;
	this.breed = null;
	for (var b in Tacticode.Entity.Breed)
		if (entity.breed == Tacticode.Entity.Breed[b].name){
			this.breed = Tacticode.Entity.Breed[b];
			break;
		}
	
	this.team = entity.team;
	this.health = entity.health;
	this.maxHealth = this.health;
	this.name = entity.name || this.randomName();
	this.weapon = entity.weapon || "sword1";
	this.container = new PIXI.Container();
	Tacticode.entities.container.addChild(this.container);
	this.text = this.initText();
	this.healthBar = this.initHealthBar();
	
	var e = this;
	Tacticode.CustomTexture.entityTexture(this, function(textures) {
		e.textures = textures;
		e.textureId = 0;
		e.sprite = new PIXI.Sprite(e.textures[0]);
		e.sprite.anchor.x = 0.5;
		e.sprite.anchor.y = 0.5;
		// Tacticode.entities.container.addChild(e.sprite);
		e.container.addChild(e.sprite);
		e.updateSpritePos();
		callback();
	});
	this.animator = animator;
}

Tacticode.Entity.FONT = "bold 16px Arial";
Tacticode.Entity.TEXT_COLORS = ["blue", "red"];
Tacticode.Entity.HB_HEIGHT = 8;
Tacticode.Entity.HB_Y = -45;
Tacticode.Entity.HB_WIDTH = 50;
Tacticode.Entity.HB_X = -Tacticode.Entity.HB_WIDTH / 2;

Tacticode.Entity.prototype.initText = function() {
	var text = new PIXI.Text(this.name, {
		font : Tacticode.Entity.FONT,
		fill : Tacticode.Entity.TEXT_COLORS[this.team],
		dropShadow : true,
		dropShadowColor : 0x000000,
		dropShadowDistance : 2
	});
	text.x = 0;
	text.y = -60;
	text.anchor.set(0.5, 0.5);
	this.container.addChild(text);
	return text;
}

Tacticode.Entity.prototype.initHealthBar = function() {
	var bar = new PIXI.Graphics();
	bar.beginFill(0x00FF00);
	bar.lineStyle(1, 0x000000);
	bar.drawRect(Tacticode.Entity.HB_X, Tacticode.Entity.HB_Y,
		Tacticode.Entity.HB_WIDTH, Tacticode.Entity.HB_HEIGHT);
	this.container.addChild(bar);
	return bar;
}

Tacticode.Entity.prototype.randomName = function() {
	var names = ["Toto", "Titi", "Tutu", "Tata"];
	return names[Math.floor(Math.random() * names.length)];
}

Tacticode.Entity.prototype.updateHealthBar = function() {
	var bar = this.healthBar;
	var health = Math.min(Math.max(this.health / this.maxHealth, 0), 1);
	bar.clear();
	bar.beginFill(0x00FF00);
	bar.lineStyle(0, 0x000000);
	var width = Tacticode.Entity.HB_WIDTH * health;
	bar.drawRect(Tacticode.Entity.HB_X, Tacticode.Entity.HB_Y,
		Tacticode.Entity.HB_WIDTH, Tacticode.Entity.HB_HEIGHT);
	
	bar.beginFill(0xFF0000);
	var x = Tacticode.Entity.HB_X + Tacticode.Entity.HB_WIDTH * health;
	width = Tacticode.Entity.HB_WIDTH * (1 - health);
	bar.drawRect(x, Tacticode.Entity.HB_Y,
		width, Tacticode.Entity.HB_HEIGHT);
	
	bar.beginFill(0x00FF00, 0);
	bar.lineStyle(1, 0x000000);
	bar.drawRect(Tacticode.Entity.HB_X, Tacticode.Entity.HB_Y,
		Tacticode.Entity.HB_WIDTH, Tacticode.Entity.HB_HEIGHT);
}

Tacticode.Entity.prototype.updateSpritePos = function() {
	var coords = Tacticode.Map.mapToProjection(this.x, this.y, this.z);
    this.container.x = coords[0] + Tacticode.GAME_WIDTH / 2;
    this.container.y = coords[1] + Tacticode.GAME_HEIGHT / 4;
	
	/*var darkness = 0xFF - this.z * 15;
    this.sprite.tint = (darkness << 16) + (darkness << 8) + darkness;*/
}

Tacticode.Entity.prototype.updateSpriteDirection = function(startX, startY, endX, endY) {
	if (startX === endX && startY === endY) {
		return;
	}
	var distX = Math.abs(endX - startX);
	var distY = Math.abs(endY - startY);
	var id;
	if (distX >= distY)
		id = endX > startX ? 1 : 2;
	else
		id = endY > startY ? 0 : 3;
	this.textureId = id;
	this.sprite.texture = this.textures[id];
}

Tacticode.Entity.prototype.updateSpriteAttack = function(attack = true){
	if (attack)
		this.textureId += 4;
	else
		this.textureId -= 4;
	this.sprite.texture = this.textures[this.textureId];
}

/*Tacticode.Entity.Textures = {
	Test:{name:"test",
	ul:PIXI.Texture.fromImage("assets/test/character_ul.png"),
	ur:PIXI.Texture.fromImage("assets/test/character_ur.png"),
	dl:PIXI.Texture.fromImage("assets/test/character_dl.png"),
	dr:PIXI.Texture.fromImage("assets/test/character_dr.png")},
	Orc1:{name:"orc1",
	ul:PIXI.Texture.fromImage("assets/sprites/character/orc1/orc1_ul.png"),
	ur:PIXI.Texture.fromImage("assets/sprites/character/orc1/orc1_ur.png"),
	dl:PIXI.Texture.fromImage("assets/sprites/character/orc1/orc1_dl.png"),
	dr:PIXI.Texture.fromImage("assets/sprites/character/orc1/orc1_dr.png")},
	Elf1:{name:"elf1",
	ul:PIXI.Texture.fromImage("assets/sprites/character/elf1/elf1_ul.png"),
	ur:PIXI.Texture.fromImage("assets/sprites/character/elf1/elf1_ur.png"),
	dl:PIXI.Texture.fromImage("assets/sprites/character/elf1/elf1_dl.png"),
	dr:PIXI.Texture.fromImage("assets/sprites/character/elf1/elf1_dr.png")}
}*/

Tacticode.Entity.Breed = {
	Human:{name:"human"},//, defaultTextures:Tacticode.Entity.Textures.Test},
	Orc:{name:"orc"},//, defaultTextures:Tacticode.Entity.Textures.Orc1},
	Elf:{name:"elf"}//, defaultTextures:Tacticode.Entity.Textures.Elf1}
}

Tacticode.Entity.prototype.debug = function() {
	console.log("entity: ");
	console.log("id:" + this.id);
	console.log("x:" + this.x);
	console.log("y:" + this.y);
	console.log("z:" + this.z);
	console.log("breed:" + this.breed.name);
	console.log("team:" + this.team);
}

Tacticode.EntityAnimator = function (stage) {
	this.container = new PIXI.Container();
	this.entities = {};
	this.map = null;
	stage.addChild(this.container);
}

Tacticode.EntityAnimator.prototype.loadEntities = function(entities, map, next) {
	this.map = map;
	var loadedEntities = 0;
	var callback = function(){
		console.log("loadedEntities: " + (loadedEntities + 1)+ "/" + entities.length);
		if (++loadedEntities == entities.length)
			next();
	}
	
	for (var e of entities){
		this.entities[e.id] = new Tacticode.Entity(e, this, callback);
	}
}

Tacticode.EntityAnimator.prototype.getEntityOnCell = function (x, y, z) {
	for (var key in this.entities) {
		let entity = this.entities[key];
		if (entity.x == x && entity.y == y && entity.z == z && entity.sprite.renderable) {
			return entity;
		}
	}
	return null;
};

Tacticode.EntityAnimator.prototype.animateAction = function* (action) {
	var entity = this.entities[action.entity];
	
	if (action.type == "damage") {
		Tacticode.sound.play('impact');
		entity.health -= action.health;
		var coords = Tacticode.Map.mapToProjection(entity.x, entity.y, entity.z);
		Tacticode.overlayManager.addDamage(coords[0], coords[1], action.health);
		entity.updateHealthBar();
		return;
	}
	if (action.type == "heal") {
		entity.health += action.health;
		var coords = Tacticode.Map.mapToProjection(entity.x, entity.y, entity.z);
		Tacticode.overlayManager.addHeal(coords[0], coords[1], action.health);
		entity.updateHealthBar();
		return;
	}
	if (action.type == "death") {
		entity.container.renderable = false;
		return;
	}
	
	var startX = entity.x;
	var startY = entity.y;
	var startZ = entity.z;
	var endX = action.x;
	var endY = action.y;
	var endZ = Tacticode.map.getCell(endX, endY).z + 1;
	
	entity.updateSpriteDirection(startX, startY, endX, endY);
	if (action.type == "move"){
		var nbFrame = 45;
		for (var i = 1; i <= nbFrame; i += Tacticode.speed){
			entity.x = (startX * (nbFrame - i) + endX * i) / nbFrame;
			entity.y = (startY * (nbFrame - i) + endY * i) / nbFrame;
			entity.z = (startZ * (nbFrame - i) + endZ * i) / nbFrame;
			entity.updateSpritePos();
			yield null;
		}
	}
	else if (action.type == "skill") {
		Tacticode.sound.play('swing');

		if (startX === endX && startY === endY) {
			startZ = endZ + 1;
		}
		
		var startCoords = Tacticode.Map.mapToProjection(startX, startY, startZ);
		var endCoords = Tacticode.Map.mapToProjection(endX, endY, endZ);
		var nbFrames = Tacticode.projectiles.addWithString(
		{x:startCoords[0] + Tacticode.GAME_WIDTH / 2, y:startCoords[1] + Tacticode.GAME_HEIGHT / 4},
		{x:endCoords[0] + Tacticode.GAME_WIDTH / 2, y:endCoords[1] + Tacticode.GAME_HEIGHT / 4},
		action.skill);
		entity.updateSpriteAttack(true);
		yield* Tacticode.Fight.waitFrames(20);
		entity.updateSpriteAttack(false);
		yield* Tacticode.Fight.waitFrames(nbFrames - 20);
	}
}

Tacticode.EntityAnimator.prototype.backupEntity = function(action){
	var entity = this.entities[action.entity];
	var sprite = entity.sprite;
	var container = entity.container;
	return {
		entity:entity,
		x:entity.x,
		y:entity.y,
		z:entity.z,
		health:entity.health,
		texture:sprite.texture,
		pixelX:container.x,
		pixelY:container.y,
		alive:container.renderable
	};
}

Tacticode.EntityAnimator.prototype.undoEntityAnimation = function(backup){
	var entity = backup.entity;
	var sprite = entity.sprite;
	var container = entity.container;
	entity.x = backup.x;
	entity.y = backup.y;
	entity.z = backup.z;
	entity.health = backup.health;
	sprite.texture = backup.texture;
	container.x = backup.pixelX;
	container.y = backup.pixelY;
	container.renderable = backup.alive;
	entity.updateHealthBar();
}
