Tacticode.Test = {};

Tacticode.Test.demo = function* (){
	yield* Tacticode.Test.wait(0.1);
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

Tacticode.Test.demoJSON = function* (){
	console.log("demoJSON");
	
	var fight = Tacticode.Test.getJSON("test/fight.json");
	
	var map = new Tacticode.Map();
	map.loadFromName(fight.map, function () {
		Tacticode.stage.addChild(map.container);
	});
	
	
	yield* Tacticode.Test.wait(1);
	
	Tacticode.entities.loadEntities(fight.entities, map);
	
	console.log("actions:")
	for (var x in fight.actions)
		console.log(x);
	
	/*var d = Tacticode.Test.demo();
	for (var i = 0; i < 600; i++)
		yield d.next();*/
	console.log("end test");
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