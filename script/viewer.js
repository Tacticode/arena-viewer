var MapData = {
    name: "Sample map",
    x: 12,
    y: 12,
    background: "space.png",
    grounds: [
        {z: 0, tile: 100}
    ],
    cells: [
        {x: 1, y: 4, z: 1, tile: 100},
        {x: 1, y: 2, z: 1, tile: 100},
        
        {x: 3, y: 7, z: 1, tile: 100},
        
        {x: 2, y: 8, z: 1, tile: 100},
        {x: 1, y: 8, z: 2, tile: 100},
        {x: 1, y: 8, z: 1, tile: 100},
        
        {x: 2, y: 7, z: 1, tile: 100},
        {x: 2, y: 7, z: 2, tile: 100},
        
        {x: 2, y: 6, z: 1, tile: 100},
        {x: 2, y: 6, z: 2, tile: 100},
        {x: 2, y: 6, z: 3, tile: 100},
        
        {x: 2, y: 5, z: 1, tile: 100},
        {x: 2, y: 5, z: 2, tile: 100},
        {x: 2, y: 5, z: 3, tile: 100},
        {x: 2, y: 5, z: 4, tile: 100},
        
        
        {x: 7, y: 8, z: 1, tile: 100},
        {x: 8, y: 8, z: 1, tile: 100},
        {x: 9, y: 8, z: 1, tile: 100},
        {x: 8, y: 8, z: 2, tile: 100},
        {x: 9, y: 8, z: 2, tile: 100},
        {x: 9, y: 8, z: 3, tile: 100}
    ],
}

$(function () {
    Tacticode.init();
    
    var map = new Tacticode.Map();
    map.loadFromData(MapData);

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