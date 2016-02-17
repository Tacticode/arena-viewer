Tacticode.Test = {};

Tacticode.Test.demo = function* (){
	yield* Tacticode.Test.wait(0.1);
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
		yield* Tacticode.Test.wait(1);
		Tacticode.projectiles.add(pos1, pos2, Tacticode.Projectile.Type.Fire);
		yield* Tacticode.Test.wait(1);
		Tacticode.projectiles.add(pos2, pos1, Tacticode.Projectile.Type.Ice);
	}
}

Tacticode.Test.demoJSON = function* (){
	console.log("demoJSON");
	
	var fight = Tacticode.Test.getJSON("test/fight.json");
	
	var map = new Tacticode.Map();
	map.loadFromName(fight.map, function () {
		Tacticode.stage.addChild(map.container);
	});
	
	yield* Tacticode.Test.wait(0.1);
	
	Tacticode.entities.loadEntities(fight.entities, map);
	
	for (var a of fight.actions){
		yield* Tacticode.entities.animateAction(a);
	}
	
	console.log("end demo");
}

Tacticode.Test.wait = function* (time){
	var nbFrames = 60 * time;
	while (--nbFrames >= 0)
		yield null;
}

Tacticode.Test.getJSON = function(path){
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", path, false);
	xmlhttp.send();
	return JSON.parse(xmlhttp.response);
}