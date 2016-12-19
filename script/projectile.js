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
	this.startPosition = startPosition;
	this.endPosition = endPosition;
    
	if (type.trajectory == "fall")
		this.startPosition.z += 10;
    
	var startCoords = Tacticode.Map.mapToProjection(startPosition.x, startPosition.y, startPosition.z);
	var endCoords = Tacticode.Map.mapToProjection(endPosition.x, endPosition.y, endPosition.z);
	this.startPixels = {x:startCoords[0] + Tacticode.GAME_WIDTH / 2, y:startCoords[1] + Tacticode.GAME_HEIGHT / 4};
	this.endPixels = {x:endCoords[0] + Tacticode.GAME_WIDTH / 2, y:endCoords[1] + Tacticode.GAME_HEIGHT / 4};
	this.position = {x:startPosition.x, y:startPosition.y, z:startPosition.z};
    
	var x = startPosition.x - endPosition.x;
	var y = startPosition.y - endPosition.y;
    var z = startPosition.z - endPosition.z;
	this.nbFrames = 50 * Math.sqrt((x * x) + (y * y) + (z * z)) / type.speed;
	this.currentFrame = 0;
	this.type = type;
	this.sprite = new PIXI.Sprite(type.texture);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.x = this.startPixels.x;
	this.sprite.y = this.startPixels.y;
	this.animator = animator;
	this.particle = null;
	if (type.particleType != null)
		for (var t in Tacticode.Projectile.Type)
			if (type.particleType == Tacticode.Projectile.Type[t].name){
				this.particle = Tacticode.Projectile.Type[t];
				break;
			}
	if (type.orientedTexture)
		this.sprite.rotation = Math.atan2(startCoords.y - endCoords.y, startCoords.x - endCoords.x);
	Tacticode.map.updateZOrder(this.sprite, x, y, z);
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
	return {x: startPos.x + Math.random(-length, length),
			y: startPos.y + Math.random(-length, length),
			z: startPos.z + Math.random(-length, length)}
}

/**
 * Generate particle effect of a projectile
 */
Tacticode.Projectile.prototype.particleEffect = function() {
	if (this.currentFrame > this.nbFrames){
		for (var i = 0; i < 10; i++){
			var pos = {x:this.position.x, y:this.position.y, z:this.position.z};
			var endPos = Tacticode.Projectile.randomMove(pos, this.type.particleDistance);
			this.animator.add(pos, endPos, this.particle);
		}
	}
	else if (Math.random() < 0.2){
		var pos = {x:this.position.x, y:this.position.y, z:this.position.z};
		var endPos = Tacticode.Projectile.randomMove(pos, this.type.particleDistance);
		this.animator.add(pos, endPos, this.particle);
	}
}

/**
 * Update the position of the projectile
 */
Tacticode.Projectile.prototype.update = function() {
	var progress = this.currentFrame / this.nbFrames;
	this.sprite.position.x = this.startPixels.x * (1 - progress) + this.endPixels.x * progress;
	this.sprite.position.y = this.startPixels.y * (1 - progress) + this.endPixels.y * progress;
	this.position.x = this.startPosition.x * (1 - progress) + this.endPosition.x * progress;
	this.position.y = this.startPosition.y * (1 - progress) + this.endPosition.y * progress;
	this.position.z = this.startPosition.z * (1 - progress) + this.endPosition.z * progress;
	Tacticode.map.updateZOrder(this.sprite, this.position.x, this.position.y, this.position.z);
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
	var toRemove = [];
	for (var p of this.projectiles) {
		if (p.currentFrame > p.nbFrames) {
			this.container.removeChild(p.sprite);
			toRemove.push(p.sprite);
        }
        else
			p.update();
	}
	function filter (sprite) {
		return !(sprite in toRemove);
	}
	this.projectiles = this.projectiles.filter(filter);
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
