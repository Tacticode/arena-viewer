Tacticode.Fight = {
	textureNext: PIXI.Texture.fromImage("assets/sprites/buttons/next.png"),
	texturePlay: PIXI.Texture.fromImage("assets/sprites/buttons/play.png"),
	texturePause: PIXI.Texture.fromImage("assets/sprites/buttons/pause.png"),
	textureStop: PIXI.Texture.fromImage("assets/sprites/buttons/stop.png")
};

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
		Tacticode.Fight.pauseButton.texture = Tacticode.Fight.texturePlay;
	else
		Tacticode.Fight.pauseButton.texture = Tacticode.Fight.texturePause;
	Tacticode.Fight.isPlaying = !Tacticode.Fight.isPlaying;
}

Tacticode.Fight.stop = function(){
	Tacticode.Fight.stopPressed = true;
}

Tacticode.Fight.next = function(){
	Tacticode.Fight.skipPressed = true;
}

Tacticode.Fight.prev = function(){
	Tacticode.Fight.undoPressed = true;
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
	Tacticode.Fight.currentAction = 0;
	Tacticode.Fight.skipPressed = false;
	Tacticode.Fight.undoPressed = false;
	Tacticode.Fight.stopPressed = false;
	Tacticode.Fight.undoData = [];
	
	Tacticode.Fight.stopButton = new PIXI.Sprite(Tacticode.Fight.textureStop);
	Tacticode.Fight.pauseButton = new PIXI.Sprite(Tacticode.Fight.texturePause);
	Tacticode.Fight.nextButton = new PIXI.Sprite(Tacticode.Fight.textureNext);
	Tacticode.Fight.prevButton = new PIXI.Sprite(Tacticode.Fight.textureNext);
	
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
		b.x = Tacticode.GAME_WIDTH - positions[i];
		b.y = Tacticode.GAME_HEIGHT - 17;
		b.on("mousedown", actions[i])
		.on("mouseover", Tacticode.Fight.buttonMouseOver(b))
		.on("mouseout", Tacticode.Fight.buttonMouseOut(b));
	}
}

Tacticode.Fight.mainLoop = function* (){
	var data = Tacticode.Fight.fightData;
	
	while (true){
		// saving entity information to go back in the animation
		if (Tacticode.Fight.currentAction == Tacticode.Fight.undoData.length)
			Tacticode.Fight.undoData.push(Tacticode.entities.backupEntity(data.actions[Tacticode.Fight.currentAction]));
		var animation = Tacticode.entities.animateAction(data.actions[Tacticode.Fight.currentAction]);
		
		do { // animate until a button is pressed or the current animation is over
			while (!Tacticode.Fight.isPlaying
				&& !Tacticode.Fight.skipPressed
				&& !Tacticode.Fight.undoPressed
				&& !Tacticode.Fight.stopPressed)
				yield null; // pause
			if (Tacticode.Fight.undoPressed || Tacticode.Fight.stopPressed)
				break;
			if (!Tacticode.Fight.skipPressed)
				yield null;
		} while (!animation.next().done);
		if (Tacticode.Fight.skipPressed){ // next button pressed
			if (Tacticode.Fight.currentAction < data.actions.length - 1)
				++Tacticode.Fight.currentAction;
			Tacticode.Fight.skipPressed = false;
			Tacticode.projectiles.clear();
		}
		else if (Tacticode.Fight.undoPressed){ // undo button pressed
			Tacticode.entities.undoEntityAnimation(Tacticode.Fight.undoData[Tacticode.Fight.currentAction]);
			if (Tacticode.Fight.currentAction > 0)
				Tacticode.entities.undoEntityAnimation(Tacticode.Fight.undoData[--Tacticode.Fight.currentAction]);
			while (Tacticode.Fight.currentAction > 0 && data.actions[Tacticode.Fight.currentAction].type == 'damage')
				Tacticode.entities.undoEntityAnimation(Tacticode.Fight.undoData[--Tacticode.Fight.currentAction]);
			Tacticode.Fight.undoPressed = false;
			Tacticode.projectiles.clear();
		}
		else if (Tacticode.Fight.stopPressed){ // stop button pressed
			while (Tacticode.Fight.currentAction >= 0)
				Tacticode.entities.undoEntityAnimation(Tacticode.Fight.undoData[Tacticode.Fight.currentAction--]);
			Tacticode.Fight.currentAction = 0;
			if (Tacticode.Fight.isPlaying)
				Tacticode.Fight.pause();
			Tacticode.Fight.stopPressed = false;
			Tacticode.projectiles.clear();
		}
		else{
			if (Tacticode.Fight.currentAction < data.actions.length - 1)
				++Tacticode.Fight.currentAction;
			else if (Tacticode.Fight.isPlaying)
				Tacticode.Fight.pause();
		}
	}
}

Tacticode.Fight.play = function (data) {
	Tacticode.Fight.fightData = data;
	Tacticode.loadMap(Tacticode.Fight.fightData.map, function () {
		Tacticode.entities.loadEntities(Tacticode.Fight.fightData.entities, Tacticode.map, function() {
			Tacticode.animateFight = function* () {
				Tacticode.Fight.initButtons();
				yield* Tacticode.Fight.mainLoop();
			}();
		});
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
