Tacticode.Entity = function(entity, animator){
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
	this.textures = this.breed.defaultTexture;
	this.sprite = new PIXI.Sprite(this.textures.dl);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	Tacticode.stage.addChild(this.sprite);
	this.animator = animator;
	this.updateSpritePos();
}

Tacticode.Entity.prototype.updateSpritePos = function(){
	var coords = this.animator.map._mapToProjection(this.x, this.y, this.z);
    this.sprite.x = coords[0] + Tacticode.GAME_WIDTH / 2;
    this.sprite.y = coords[1] + Tacticode.GAME_HEIGHT / 4;
	
	var darkness = 0xFF - this.z * 15;
    this.sprite.tint = (darkness << 16) + (darkness << 8) + darkness;
}

Tacticode.Entity.Textures = {
	Test:{name:"test",
	ul:PIXI.Texture.fromImage("assets/test/character_ul.png"),
	ur:PIXI.Texture.fromImage("assets/test/character_ur.png"),
	dl:PIXI.Texture.fromImage("assets/test/character_dl.png"),
	dr:PIXI.Texture.fromImage("assets/test/character_dr.png")}
}

Tacticode.Entity.Breed = {
	Human:{name:"human", defaultTexture:Tacticode.Entity.Textures.Test},
	Orc:{name:"orc", defaultTexture:Tacticode.Entity.Textures.Test},
	Elf:{name:"elf", defaultTexture:Tacticode.Entity.Textures.Test}
}

Tacticode.Entity.prototype.debug = function(){
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