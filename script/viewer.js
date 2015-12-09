/**
 * Tacticode - Viewer
 * Main file of the project, contains the jQuery entrypoint.
 */

$(function () {
    Tacticode.init();
    
    var map = new Tacticode.Map();
	
	map.loadFromData(Tacticode.maps.sample);
		
	Tacticode.stage.addChild(map.container);
	Tacticode.projectiles.add({x:0,y:0}, {x:1000,y:1000}, 10000,  new PIXI.Sprite(PIXI.Texture.fromImage("assets/test/fireball.png")));
		
	var oldCell = null;
	Tacticode.stage.interactive = true;
	Tacticode.stage.on('mousemove', function (data) {
		var mappos = projectionToMap(data.data.global.x - Tacticode.GAME_WIDTH / 2, data.data.global.y - Tacticode.GAME_HEIGHT / 4);
		var cell = null;
		var z = 10;
		while (cell == null && z >= 0) {
			cell = map.getCell(mappos[0] + z, mappos[1] + z, z);
			z -= 1;
		}
		if (oldCell) {
			oldCell.sprite.tint += 0xC0;
		}
		if (cell) {
			cell.sprite.tint -= 0xC0;
			oldCell = cell;
		} else {
			oldCell = null;
		}
	});
});
