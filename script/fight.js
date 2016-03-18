Tacticode.Fight = {};

Tacticode.Fight.demo = function* (){
	yield* Tacticode.Fight.wait(0.1);
	var c1 = Tacticode.stage.addChild(new PIXI.Sprite.fromImage("assets/test/character_dl.png"));
	var c2 = Tacticode.stage.addChild(new PIXI.Sprite.fromImage("assets/test/character_ur.png"));
	c1.x = 480;
	c1.y = 130;
	c2.x = 350;
	c2.y = 190;
	c1.anchor.x = 0.5;
	c1.anchor.y = 0.5;
	c2.anchor.x = 0.5;
	c2.anchor.y = 0.5;
	
	var pos1 = {x:c1.x, y:c1.y};
	var pos2 = {x:c2.x, y:c2.y};
	
	while (true){
		yield* Tacticode.Fight.wait(1);
		Tacticode.projectiles.add(pos1, pos2, Tacticode.Projectile.Type.Fire);
		yield* Tacticode.Fight.wait(1);
		Tacticode.projectiles.add(pos2, pos1, Tacticode.Projectile.Type.Ice);
	}
}

Tacticode.Fight.pause = function(){
	if (Tacticode.Fight.isPlaying)
		Tacticode.Fight.pauseButton.texture = PIXI.Texture.fromImage("assets/sprites/buttons/play.png");
	else
		Tacticode.Fight.pauseButton.texture = PIXI.Texture.fromImage("assets/sprites/buttons/pause.png");
	Tacticode.Fight.isPlaying = !Tacticode.Fight.isPlaying;
}

Tacticode.Fight.stop = function(){
	Tacticode.projectiles.clear();
}

Tacticode.Fight.next = function(){
	console.log("next");
}

Tacticode.Fight.prev = function(){
	console.log("prev");
}

Tacticode.Fight.buttonMouseOver = function(sprite){
	return function(){
		sprite.scale.x = 1;
		sprite.scale.y = 1;
	}
}

Tacticode.Fight.buttonMouseOut = function(sprite){
	return function(){
		sprite.scale.x = 0.9;
		sprite.scale.y = 0.9;
	}
}

Tacticode.Fight.initButtons = function(){
	Tacticode.Fight.isPlaying = true;
	
	Tacticode.Fight.stopButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/sprites/buttons/stop.png"));
	Tacticode.Fight.pauseButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/sprites/buttons/pause.png"));
	Tacticode.Fight.nextButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/sprites/buttons/next.png"));
	Tacticode.Fight.prevButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/sprites/buttons/next.png"));
	
	var buttons = [Tacticode.Fight.nextButton, Tacticode.Fight.pauseButton,
		Tacticode.Fight.stopButton, Tacticode.Fight.prevButton];
	var positions = [16, 48, 80, 112];
	var rotations = [0, 0, 0, Math.PI];
	var actions = [Tacticode.Fight.next, Tacticode.Fight.pause,
		Tacticode.Fight.stop, Tacticode.Fight.prev];
	var x = Tacticode.GAME_WIDTH;
	for (var i = 0; i < buttons.length; i++){
		var b = buttons[i];
		b.buttonMode = true;
		b.interactive = true;
		Tacticode.stage.addChild(b);
		b.anchor.x = 0.5;
		b.anchor.y = 0.5;
		b.scale.x = 0.9;
		b.scale.y = 0.9;
		b.rotation = rotations[i];
		console.log(b.width);
		b.x = Tacticode.GAME_WIDTH - positions[i];
		b.y = Tacticode.GAME_HEIGHT - 17;
		b.on("mousedown", actions[i])
		.on("mouseover", Tacticode.Fight.buttonMouseOver(b))
		.on("mouseout", Tacticode.Fight.buttonMouseOut(b));
	}
}

Tacticode.Fight.demoJSON = function (){
	console.log("demoJSON");
	
	var fight = Tacticode.Fight.getJSON("test/fight.json");
	
	Tacticode.loadMap(fight.map, function () {
		Tacticode.animateTest = function* () {
			console.log("map loaded");
			
			Tacticode.entities.loadEntities(fight.entities, Tacticode.map);
			Tacticode.Fight.initButtons();
			
			for (var a of fight.actions){
				while (!Tacticode.Fight.isPlaying)
					yield null;
				yield* Tacticode.entities.animateAction(a);
			}
			
			console.log("end demo");
		}();
	});
}

Tacticode.Fight.wait = function* (time){
	var nbFrames = 60 * time;
	while (--nbFrames >= 0)
		yield null;
}

Tacticode.Fight.waitFrames = function* (nbFrames){
	while (--nbFrames >= 0)
		yield null;
}

Tacticode.Fight.getJSON = function(path){
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", path, false);
	xmlhttp.send();
	return JSON.parse(xmlhttp.response);
}