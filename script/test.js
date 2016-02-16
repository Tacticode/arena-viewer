Tacticode.Test = {};

Tacticode.Test.demo = function* (){
	for (var i = 0; i < 10; i++)
		yield null;
	var c1 = Tacticode.stage.addChild(new PIXI.Sprite.fromImage("assets/test/character_dl.png"));
	var c2 = Tacticode.stage.addChild(new PIXI.Sprite.fromImage("assets/test/character_ur.png"));
	c1.x = 480;
	c1.y = 130;
	c2.x = 350;
	c2.y = 190;
	
	var pos1 = {x:c1.x - c1.width / 2 - 10, y:c1.y - c1.height / 2 - 15};
	var pos2 = {x:c2.x - c2.width / 2 - 15, y:c2.y - c2.height / 2 - 10};
	
	while (true){
		yield* Tacticode.Test.wait(1);
		Tacticode.projectiles.add(pos1, pos2, Tacticode.Projectile.Type.Fire);
		yield* Tacticode.Test.wait(1);
		Tacticode.projectiles.add(pos2, pos1, Tacticode.Projectile.Type.Ice);
	}
}

Tacticode.Test.wait = function* (time){
	var nbFrames = 60 * time;
	while (nbFrames-- > 0)
		yield null;
}
