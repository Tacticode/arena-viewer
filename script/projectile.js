Projectile = function(startPosition, endPosition, nbFrames, sprite) {
	this.start = startPosition;
	this.end = endPosition;
	this.nbFrames = nbFrames;
	this.currentFrame = 0;
	this.sprite = sprite;
}

Projectile.prototype.update = function() {
	var progress = this.currentFrame / this.nbFrames;
	this.sprite.position.x = this.start.x * (1 - progress) + this.end.x * progress;
	this.sprite.position.y = this.start.y * (1 - progress) + this.end.y * progress;
	this.currentFrame++;
}

ProjectilesAnimator = function(container) {
	this.container = container;
	this.projectiles = [];
}

checkDelete = function(p) {
	return p.currentFrame <= p.nbFrames;
}

ProjectilesAnimator.prototype.animate = function() {
	for (var p of this.projectiles) {
		p.update();
		if (p.currentFrame > p.nbFrames)
			this.container.removeChild(p.sprite);
	}
	this.projectiles = this.projectiles.filter(checkDelete);
}

ProjectilesAnimator.prototype.add = function(startPosition, endPosition, nbFrames, sprite) {
	this.projectiles.push(new Projectile(startPosition, endPosition, nbFrames, sprite));
	this.container.addChild(sprite);
}
