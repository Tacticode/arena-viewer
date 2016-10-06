/**
 * Tacticode - Fight
 */

"use strict"

Tacticode.Fight = {};

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

Tacticode.Fight.speed = function(){
	if (Tacticode.speed > 2)
		Tacticode.speed = 1;
	else
		Tacticode.speed++;
	Tacticode.Fight.speedText.text = "x" + Tacticode.speed;
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
	var fight = Tacticode.Fight;
	
	fight.isPlaying = true;
	fight.currentAction = 0;
	fight.skipPressed = false;
	fight.undoPressed = false;
	fight.stopPressed = false;
	fight.undoData = [];

	fight.textureNext = PIXI.Texture.fromImage(Tacticode.ASSETS_PATH + "sprites/buttons/next.png");
	fight.texturePlay = PIXI.Texture.fromImage(Tacticode.ASSETS_PATH + "sprites/buttons/play.png");
	fight.texturePause = PIXI.Texture.fromImage(Tacticode.ASSETS_PATH + "sprites/buttons/pause.png");
	fight.textureStop = PIXI.Texture.fromImage(Tacticode.ASSETS_PATH + "sprites/buttons/stop.png");
	fight.textureSpeed = PIXI.Texture.fromImage(Tacticode.ASSETS_PATH + "sprites/buttons/speed.png");
	
	fight.stopButton = new PIXI.Sprite(fight.textureStop);
	fight.pauseButton = new PIXI.Sprite(fight.texturePause);
	fight.nextButton = new PIXI.Sprite(fight.textureNext);
	fight.prevButton = new PIXI.Sprite(fight.textureNext);
	fight.speedButton = new PIXI.Sprite(fight.textureSpeed);
	
	var buttons = [fight.nextButton, fight.pauseButton,
		fight.stopButton, fight.prevButton,
		fight.speedButton];
	var positions = [16, 48, 80, 112, 144];
	var rotations = [0, 0, 0, Math.PI, 0];
	var actions = [fight.next, fight.pause,
		fight.stop, fight.prev,
		fight.speed];
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
		.on("mouseover", fight.buttonMouseOver(b))
		.on("mouseout", fight.buttonMouseOut(b));
	}
	
	fight.speedText = fight.initText(fight.speedButton.x - 35, fight.speedButton.y);
}

Tacticode.Fight.initText = function(x, y) {
	var text = new PIXI.Text("x1", {
		font : "bold 24px Arial",
		fill : 0x000000,
	});
	text.x = x;
	text.y = y;
	text.anchor.set(0.5, 0.5);
	Tacticode.stage.addChild(text);
	return text;
}

Tacticode.Fight.mainLoop = function* (){
	var fight = Tacticode.Fight;
	var data = fight.fightData;
	
	data.actions.push({
		'type': 'winner',
		'winner': data.winner
	})
	
	if (data.actions.length === 0) return;
	
	fight.currentTurn = 1;
	fight.currentWinner = null;
	
	while (true){
		// saving entity information to go back in the animation
		var animation = fight.animateAction(data);
		
		do { // animate until a button is pressed or the current animation is over
			while (!fight.isPlaying
				&& !fight.skipPressed
				&& !fight.undoPressed
				&& !fight.stopPressed)
				yield null; // pause
			if (fight.undoPressed || fight.stopPressed)
				break;
			if (!fight.skipPressed)
				yield null;
		} while (!animation.next().done);
		if (fight.skipPressed){ // next button pressed
			if (fight.currentAction < data.actions.length - 1)
				++fight.currentAction;
			while (fight.currentAction < data.actions.length - 1 && fight.isCurrentActionInstant())
				++fight.currentAction;
			fight.skipPressed = false;
			Tacticode.projectiles.clear();
		}
		else if (fight.undoPressed){ // undo button pressed
			fight.undoActions();
			fight.undoPressed = false;
			Tacticode.projectiles.clear();
		}
		else if (fight.stopPressed){ // stop button pressed
			fight.undoAllActions();
			if (fight.isPlaying)
				fight.pause();
			fight.stopPressed = false;
			Tacticode.projectiles.clear();
		}
		else{
			if (fight.currentAction < data.actions.length - 1)
				++fight.currentAction;
			else if (fight.isPlaying)
				fight.pause();
		}
	}
}

Tacticode.Fight.animateAction = function* () {
	var fight = Tacticode.Fight;
	var data = fight.fightData;
	var action = data.actions[fight.currentAction];
	if (action.entity) {
		// entity action
		if (fight.currentAction == fight.undoData.length)
			fight.undoData.push(Tacticode.entities.backupEntity(action));
		yield* Tacticode.entities.animateAction(action);
	} else {
		// general action
		fight.undoData.push({
			'turn': fight.currentTurn,
			'winner': fight.currentWinner
		});
		if (action.type == 'newturn') {
			fight.currentTurn = action.turn;
			Tacticode.turnManager.setTurn(fight.currentTurn, true);
		}
		if (action.type == 'winner') {
			fight.currentWinner = action.winner;
			Tacticode.winnerManager.setWinner(fight.currentWinner);
		}
	}
}

Tacticode.Fight.undoActions = function () {
	var fight = Tacticode.Fight;
	if (fight.currentAction > 0)
		fight.undoAction();
	if (fight.currentAction > 0)
		fight.undoAction();
	while (fight.currentAction > 0 && fight.isCurrentActionInstant())
		fight.undoAction();
}

Tacticode.Fight.undoAllActions = function () {
	var fight = Tacticode.Fight;
	while (fight.currentAction >= 0)
		fight.undoAction();
	fight.currentAction = 0;
}

Tacticode.Fight.undoAction = function () {
	var fight = Tacticode.Fight;
	if (fight.undoData[fight.currentAction].entity) {
		// entity action
		Tacticode.entities.undoEntityAnimation(fight.undoData[fight.currentAction--]);
	} else {
		// general action
		var backup = fight.undoData[fight.currentAction--];
		fight.currentTurn = backup.turn;
		fight.currentWinner = backup.winner;
		Tacticode.turnManager.setTurn(backup.turn, false);
		Tacticode.winnerManager.setWinner(fight.currentWinner);
	}
}

Tacticode.Fight.isCurrentActionInstant = function () {
	var type = Tacticode.Fight.fightData.actions[Tacticode.Fight.currentAction].type;
	if (type == 'damage' || type == 'heal' || type == 'death' || type == 'newturn' || type == 'winner') {
		return true;
	}
	return false;
};

Tacticode.Fight.play = function (data) {
	var fight = Tacticode.Fight;
	fight.fightData = data;
	Tacticode.loadMap(fight.fightData.map, function () {
		Tacticode.entities.loadEntities(fight.fightData.entities, Tacticode.map, function() {
			Tacticode.animateFight = function* () {
				fight.initButtons();
				yield* fight.mainLoop();
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
