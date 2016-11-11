/**
 * Tacticode - Projectile
 */

"use strict"

/**
 * Class Projectile
 * @constructor
 * @param startPosition starting position of the projectile
 * @param endPosition ending position of the projectile
 * @param type ProjectileType of the projectile
 * @param animator ProjectileAnimator to use
 */
Tacticode.Projectile = function(startPosition, endPosition, type, animator) {
	this.start = startPosition;
	this.end = endPosition;
    
    if (type.trajectory == "fall")
        this.start.y -= 700;
    
	var x = startPosition.x - endPosition.x;
	var y = startPosition.y - endPosition.y; // ajouter z ?
	this.nbFrames = Math.sqrt((x * x) + (y * y)) / type.speed;
	this.currentFrame = 0;
	this.type = type;
	this.sprite = new PIXI.Sprite(type.texture);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
    this.sprite.x = startPosition.x;
    this.sprite.y = startPosition.y;
	this.animator = animator;
	this.particle = null;
	if (type.particleType != null)
		for (var t in Tacticode.Projectile.Type)
			if (type.particleType == Tacticode.Projectile.Type[t].name){
				this.particle = Tacticode.Projectile.Type[t];
				break;
			}
	if (type.orientedTexture)
		this.sprite.rotation = Math.atan2(y, x);
}

/**
 * Get a random integer between 2 values
 * @param min Minimum value
 * @param max Maximum value
 * @return The interger
 */
Tacticode.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Get a random projectile move
 * @param startPos Starting position of the projectile
 * @param length Maximum length of the move
 * @return The ending position of the move
 */
Tacticode.Projectile.randomMove = function(startPos, length){
	return {x: startPos.x + Tacticode.randomInt(-length, length),
			y: startPos.y + Tacticode.randomInt(-length, length)}
}

/**
 * Generate particle effect of a projectile
 */
Tacticode.Projectile.prototype.particleEffect = function() {
	if (this.currentFrame > this.nbFrames){
		for (var i = 0; i < 10; i++){
			var pos = {x:this.sprite.x,	y:this.sprite.y};
			var endPos = Tacticode.Projectile.randomMove(pos, this.type.particleDistance);
			this.animator.add(pos, endPos, this.particle);
		}
	}
	else if (Math.random() < 0.2){
		var pos = {x:this.sprite.x, y:this.sprite.y};
		var endPos = Tacticode.Projectile.randomMove(pos, this.type.particleDistance);
		this.animator.add(pos, endPos, this.particle);
	}
}

/**
 * Update the position of the projectile
 */
Tacticode.Projectile.prototype.update = function() {
	var progress = this.currentFrame / this.nbFrames;
	this.sprite.position.x = this.start.x * (1 - progress) + this.end.x * progress;
	this.sprite.position.y = this.start.y * (1 - progress) + this.end.y * progress;
	this.currentFrame += Tacticode.speed;
	if (this.particle != null)
		this.particleEffect();
}

/**
 * Tacticode - Projectile Animator
 */
 
 /**
  * Class ProjectileAnimator
  * @constructor
  * @param container Container of the animator
  */
Tacticode.ProjectilesAnimator = function(container) {
	this.loadTextures();
	this.container = container;
	this.projectiles = [];
}

/**
 * Load the textures of the projectiles
 */
Tacticode.ProjectilesAnimator.prototype.loadTextures = function () {
	for (var particleType in Tacticode.Projectile.Type) {
		var path = Tacticode.ASSETS_PATH + Tacticode.Projectile.Type[particleType].texturePath;
		var texture = PIXI.Texture.fromImage(path);
		Tacticode.Projectile.Type[particleType].texture = texture;
	};
};

/**
 * Check if the projectile animation is over
 * @param p the projectile
 * @return true if the animation is over
 */
Tacticode.ProjectilesAnimator.checkDelete = function(p) {
	return p.currentFrame <= p.nbFrames;
}

/**
 * Animate all the projectiles of the animator
 */
Tacticode.ProjectilesAnimator.prototype.animate = function() {
	if (!Tacticode.Fight.isPlaying)
		return;
	for (var p of this.projectiles) {
		p.update();
		if (p.currentFrame > p.nbFrames)
			this.container.removeChild(p.sprite);
	}
	this.projectiles = this.projectiles.filter(Tacticode.ProjectilesAnimator.checkDelete); // TODO optimisation ?
}

/**
 * Delete all the projectiles
 */
Tacticode.ProjectilesAnimator.prototype.clear = function() {
	for (var p of this.projectiles)
		this.container.removeChild(p.sprite);
	this.projectiles = [];
}

/**
 * Add a new projectile
 * @param startPosition Starting position of the projectile
 * @param endPosition Ending position of the projectile
 * @param type Type of the projectile
 */
Tacticode.ProjectilesAnimator.prototype.add = function(startPosition, endPosition, type) {
	var projectile = new Tacticode.Projectile(startPosition, endPosition, type, this);
	this.projectiles.push(projectile);
	this.container.addChild(projectile.sprite);
	return projectile.nbFrames + 1;
}

/**
 * Add a new projectile from a string
 * @param startPosition Starting position of the projectile
 * @param endPosition Ending position of the projectile
 * @param type Type of the projectile (string)
 */
Tacticode.ProjectilesAnimator.prototype.addWithString = function(startPosition, endPosition, typeStr) {
	var type = null;
	for (var t in Tacticode.Projectile.Type)
		if (Tacticode.Projectile.Type[t].name == typeStr)
			type = Tacticode.Projectile.Type[t];
	if (!type) type = Tacticode.Projectile.Type.Ice;
	return this.add(startPosition, endPosition, type);
}
