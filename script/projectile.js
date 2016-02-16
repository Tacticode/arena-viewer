Tacticode.Projectile = function(startPosition, endPosition, type, animator) {
	this.start = startPosition;
	this.end = endPosition;
	var x = startPosition.x - endPosition.x;
	var y = startPosition.y - endPosition.y;
	this.nbFrames = Math.sqrt((x * x) + (y * y)) / type.speed;
	this.currentFrame = 0;
	this.type = type;
	this.sprite = new PIXI.Sprite(type.texture);
	this.animator = animator;
	this.particle = null;
	if (type.particleType != null)
		for (var t in Tacticode.Projectile.Type)
			if (type.particleType == Tacticode.Projectile.Type[t].name){
				this.particle = Tacticode.Projectile.Type[t];
				break;
			}
}

Tacticode.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

Tacticode.Projectile.randomMove = function(startPos, length){
	return {x: startPos.x + Tacticode.randomInt(-length, length),
			y: startPos.y + Tacticode.randomInt(-length, length)}
}

Tacticode.Projectile.Type = {
	FireParticle:{name:"FireParticle", speed:4,
			texture:PIXI.Texture.fromImage("assets/effect/particle_fire.png"),
			particleType:null},
	IceParticle:{name:"IceParticle", speed:3,
			texture:PIXI.Texture.fromImage("assets/effect/particle_ice.png"),
			particleType:null},
	Fire:{name:"Fire", speed:15,
			texture:PIXI.Texture.fromImage("assets/effect/fireball.png"),
			particleType:"FireParticle", particleDistance:75},
	Ice:{name:"Ice", speed:8,
			texture:PIXI.Texture.fromImage("assets/effect/iceball.png"),
			particleType:"IceParticle", particleDistance:30}
}

Tacticode.Projectile.prototype.particleEffect = function() {
	if (this.currentFrame > this.nbFrames){
		for (var i = 0; i < 10; i++){
			var pos = {x:this.sprite.x + this.sprite.width / 2 - this.particle.texture.width / 2,
					y:this.sprite.y + this.sprite.height / 2 - this.particle.texture.height / 2};
			var endPos = Tacticode.Projectile.randomMove(pos, this.type.particleDistance);
			this.animator.add(pos, endPos, this.particle);
		}
	}
	else if (Math.random() < 0.2){
		var pos = {x:this.sprite.x + this.sprite.width / 2 - this.particle.texture.width / 2,
				y:this.sprite.y + this.sprite.height / 2 - this.particle.texture.height / 2};
		var endPos = Tacticode.Projectile.randomMove(pos, this.type.particleDistance);
		this.animator.add(pos, endPos, this.particle);
	}
}

Tacticode.Projectile.prototype.update = function() {
	var progress = this.currentFrame / this.nbFrames;
	this.sprite.position.x = this.start.x * (1 - progress) + this.end.x * progress;
	this.sprite.position.y = this.start.y * (1 - progress) + this.end.y * progress;
	this.currentFrame++;
	if (this.particle != null)
		this.particleEffect();
}

Tacticode.ProjectilesAnimator = function(container) {
	this.container = container;
	this.projectiles = [];
}

Tacticode.ProjectilesAnimator.checkDelete = function(p) {
	return p.currentFrame <= p.nbFrames;
}

Tacticode.ProjectilesAnimator.prototype.animate = function() {
	for (var p of this.projectiles) {
		p.update();
		if (p.currentFrame > p.nbFrames)
			this.container.removeChild(p.sprite);
	}
	this.projectiles = this.projectiles.filter(Tacticode.ProjectilesAnimator.checkDelete); // TODO optimisation ?
}

Tacticode.ProjectilesAnimator.prototype.add = function(startPosition, endPosition, type) {
	var projectile = new Tacticode.Projectile(startPosition, endPosition, type, this);
	this.projectiles.push(projectile);
	this.container.addChild(projectile.sprite);
}
