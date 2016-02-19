Tacticode.Map = function () {
    this.name = "";
    this.x = 0;
    this.y = 0;
    this.background = null;
    this.cells = null;
    this.container = null;
	this.onCellSelected = null;
};

Tacticode.Map.MAP_PATH = 'script/maps/';
Tacticode.Map.STYLE_PATH = 'script/styles/';
Tacticode.Map.EXTENSION = '.json';

Tacticode.Map.prototype.loadFromName = function (name, callback) {
	var url = Tacticode.Map.MAP_PATH + name + Tacticode.Map.EXTENSION;
	var root = this;
	jQuery.getJSON(url, function (data) {
		root.loadFromData(data, callback);
	}).fail(function (data, err, text) {
		console.error('Cannot load map ' + url + ':', err, text);
	});
};

Tacticode.Map.prototype.loadFromData = function (data, callback) {
	this.name = data.name;
    this.size = {
        x: data.x,
        y: data.y,
    }
    this.offset = {
        x: Tacticode.GAME_WIDTH / 2,
        y: Tacticode.GAME_WIDTH / 4,
    }
	
    this.cells = data.cells || [];
    
	var root = this;
	this._loadStyleFromName(data.style, function () {
		root.background = root.style.background;
		root._createSprites();
		root._initEvents();
		if (callback) {
			callback();
		}
	});
};

Tacticode.Map.prototype.getCell = function (x, y, z) {
    for (var i = 0; i < this.cells.length; ++i) {
        var cell = this.cells[i];
        if (cell.x == x && cell.y == y && cell.z == z) {
            return cell;
        }
    }
    return null;
};

Tacticode.Map.prototype.containsCell = function (x, y, z) {
    return (this.getCell(x, y, z) != null);
};

Tacticode.Map.prototype._loadStyleFromName = function (name, callback) {
	var url = Tacticode.Map.STYLE_PATH + name + Tacticode.Map.EXTENSION;
	var root = this;
	jQuery.getJSON(url, function (data) {
		root.style = data;
		if (callback) {
			callback();
		}
	}).fail(function (data, err, text) {
		console.error('Cannot load style ' + url + ':', err, text);
	});
};

Tacticode.Map.prototype._initEvents = function () {
	var oldCell = null;
	this.container.interactive = true;
	var root = this;
	this.container.on('mousemove', function (data) {
		var mappos = root._projectionToMap(data.data.global.x - Tacticode.GAME_WIDTH / 2, data.data.global.y - Tacticode.GAME_HEIGHT / 4);
		var cell = null;
		var z = 10;
		while (cell == null && z >= 0) {
			cell = root.getCell(mappos[0], mappos[1], z);
			z -= 1;
		}
		if (cell === oldCell) {
			return;
		}
		if (oldCell) {
			oldCell.sprite.tint = 0xFFFFFF;
			for (var i = 0; i < oldCell.subSprites.length; ++i) {
				oldCell.subSprites[i].tint = 0xFFFFFF;
			}
		}
		if (cell) {
			var color = cell.accessible ? 0x50FF50 : 0xFF5050;
			cell.sprite.tint = color;
			for (var i = 0; i < cell.subSprites.length; ++i) {
				cell.subSprites[i].tint = color;
			}
			oldCell = cell;
		} else {
			oldCell = null;
		}
		if (root.onCellSelected) {
			root.onCellSelected(cell);
		}
	});
};

Tacticode.Map.prototype._createSprites = function () {
    this.container = new PIXI.Container();
    if (this.background) {
        var background = new PIXI.Sprite(PIXI.Texture.fromImage("assets/textures/" + this.background));
        this.container.addChild(background);
    }
    this.cells.sort(this._compareCells);
    for (var i = 0; i < this.cells.length; ++i) {
        var cellData = this.cells[i];
            
        if (cellData.tile !== 0) {
			cellData.z = cellData.z || 0;
			cellData.subSprites = [];
			
			if (cellData.z > 0) {
				for (var z = 0; z < cellData.z; ++z) {
					var texture = PIXI.Texture.fromImage("assets/sprites/" + this.style.tiles[cellData.tile].groundTexture);
					var sprite = this._createSpriteAtPosition(texture, cellData.x, cellData.y, z);
					cellData.subSprites.push(sprite);
				}
			}
		
			var texture = PIXI.Texture.fromImage("assets/sprites/" + this.style.tiles[cellData.tile].texture);
			cellData.sprite = this._createSpriteAtPosition(texture, cellData.x, cellData.y, cellData.z);
        }
    }
};

Tacticode.Map.prototype._createSpriteAtPosition = function (texture, x, y, z) {
    var tile = new PIXI.Sprite(texture);
    tile.anchor.x = 0.5;
    tile.anchor.y = 0.5;
    
    var coords = this._mapToProjection(x, y, z);
    tile.position.x = coords[0] + Tacticode.GAME_WIDTH / 2;
    tile.position.y = coords[1] + Tacticode.GAME_HEIGHT / 4;
    
    var darkness = 0xFF - z * 15;
    //if (z == 0 && this.containsCell(x, y - 1, z + 1)) {
    //    darkness -= 0x50;
    //}
    tile.tint = (darkness << 16) + (darkness << 8) + darkness;
    
    this.container.addChild(tile);
	
	return tile;
};

Tacticode.Map.prototype._compareCells = function (a, b) {
    if (a.z !== b.z) return (a.z - b.z);
    if (a.x !== b.x) return (a.x - b.x);
    return a.y - b.y;
};

Tacticode.Map.prototype._mapToProjection = function (x, y, z) {
    return [
        (x - y) * Tacticode.CELL_WIDTH_HALF,
        (x + y - z * 2) * Tacticode.CELL_HEIGHT_HALF
    ];
};

Tacticode.Map.prototype._projectionToMap = function (x, y) {
    x /= Tacticode.CELL_WIDTH_HALF;
    y /= Tacticode.CELL_HEIGHT_HALF;
    return [
        Math.ceil((x + y) / 2),
        Math.ceil((y - x) / 2)
    ];
};
