/**
 * Tacticode - Main file
 */
 
var Tacticode = {
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 768,
    CELL_WIDTH_HALF: 32,
    CELL_HEIGHT_HALF: 16
};

var demo = function* (){
	for (var i = 0; i < 10; i++)
		yield null;
	var c1 = Tacticode.stage.addChild(new PIXI.Sprite.fromImage("assets/test/character_dl.png"));
	var c2 = Tacticode.stage.addChild(new PIXI.Sprite.fromImage("assets/test/character_ur.png"));
	c1.x = 480;
	c1.y = 130;
	c2.x = 350;
	c2.y = 190;
	
	while (true){
		for (var i = 0; i < 60; i++)
			yield null;
		Tacticode.projectiles.add({x:480,y:110}, {x:320,y:180},  Projectile.Type.Fire);
		for (var i = 0; i < 60; i++)
			yield null;
		Tacticode.projectiles.add({x:320,y:180}, {x:480,y:110},  Projectile.Type.Ice);
	}
}

Tacticode.init = function () {
	Tacticode.stage = new PIXI.Container();
	Tacticode.renderer = new PIXI.autoDetectRenderer(1024, 768);
	Tacticode.projectiles = new ProjectilesAnimator(Tacticode.stage);
	Tacticode.demo = demo();
	document.body.appendChild(Tacticode.renderer.view);

    requestAnimationFrame(Tacticode.animate);
};

Tacticode.animate = function () {
    requestAnimationFrame(Tacticode.animate);
	Tacticode.update();
    Tacticode.renderer.render(Tacticode.stage);
	Tacticode.demo.next();
};

/**
 * Function called once per frame.
 */
Tacticode.update = function () {
	Tacticode.projectiles.animate();
};
