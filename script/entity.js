Tacticode.Entity = function(entity, animator) {
	this.id = entity.id;
	this.x = entity.x;
	this.y = entity.y;
	this.z = entity.z || 1;
	this.breed = null;
	for (var b in Tacticode.Entity.Breed)
		if (entity.breed == Tacticode.Entity.Breed[b].name){
			this.breed = Tacticode.Entity.Breed[b];
			break;
		}
	this.team = entity.team;
	this.textures = this.breed.defaultTextures;
	this.sprite = new PIXI.Sprite(this.textures.dl);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	Tacticode.stage.addChild(this.sprite);
	this.animator = animator;
	this.updateSpritePos();
}

Tacticode.Entity.prototype.updateSpritePos = function() {
	var coords = Tacticode.Map.mapToProjection(this.x, this.y, this.z);
    this.sprite.x = coords[0] + Tacticode.GAME_WIDTH / 2;
    this.sprite.y = coords[1] + Tacticode.GAME_HEIGHT / 4;
	
	/*var darkness = 0xFF - this.z * 15;
    this.sprite.tint = (darkness << 16) + (darkness << 8) + darkness;*/
}

Tacticode.Entity.prototype.updateSpriteDirection = function(startX, startY, endX, endY) {
	var distX = Math.abs(endX - startX);
	var distY = Math.abs(endY - startY);
	if (distX >= distY){
		if (endX > startX)
			this.sprite.texture = this.textures.dr;
		else if (endX < startX)
			this.sprite.texture = this.textures.ul;
	}
	else{
		if (endY > startY)
			this.sprite.texture = this.textures.dl;
		else if (endY < startY)
			this.sprite.texture = this.textures.ur;
	}
}

Tacticode.Entity.Textures = {
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
}

Tacticode.Entity.Breed = {
	Human:{name:"human", defaultTextures:Tacticode.Entity.Textures.Test},
	Orc:{name:"orc", defaultTextures:Tacticode.Entity.Textures.Orc1},
	Elf:{name:"elf", defaultTextures:Tacticode.Entity.Textures.Elf1}
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

Tacticode.EntityAnimator = function(container) {
	this.container = container;
	this.entities = [];
	this.map = null;
}

Tacticode.EntityAnimator.prototype.loadEntities = function(entities, map) {
	this.map = map;
	for (var e of entities){
		this.entities.push(new Tacticode.Entity(e, this));
	}
}

Tacticode.EntityAnimator.prototype.animateAction = function* (action) {
	var entity = this.entities[action.entity];
	var startX = entity.x;
	var startY = entity.y;
	var startZ = entity.z;
	var endX = action.x;
	var endY = action.y;
	var endZ = action.z || entity.z;
	
	entity.updateSpriteDirection(startX, startY, endX, endY);
	if (action.type == "move"){
		var nbFrame = 45;
		for (var i = 1; i <= nbFrame; ++i){
			entity.x = (startX * (nbFrame - i) + endX * i) / nbFrame;
			entity.y = (startY * (nbFrame - i) + endY * i) / nbFrame;
			entity.z = (startZ * (nbFrame - i) + endZ * i) / nbFrame;
			entity.updateSpritePos();
			yield null;
		}
	}
	else if (action.type == "skill"){
		// console.log(action.skill);
		
		var startCoords = Tacticode.Map.mapToProjection(startX, startY, startZ);
		var endCoords = Tacticode.Map.mapToProjection(endX, endY, endZ);
		
		var nbFrames = Tacticode.projectiles.addWithString(
		{x:startCoords[0] + Tacticode.GAME_WIDTH / 2, y:startCoords[1] + Tacticode.GAME_HEIGHT / 4},
		{x:endCoords[0] + Tacticode.GAME_WIDTH / 2, y:endCoords[1] + Tacticode.GAME_HEIGHT / 4},
		action.skill);
		yield* Tacticode.Fight.waitFrames(nbFrames);
	}
}
