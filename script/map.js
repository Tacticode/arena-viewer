Tacticode.Map = function () {
    this.name = "";
    this.x = 0;
    this.y = 0;
    this.background = null;
    this.grounds = null;
    this.cells = null;
    this.container = null;
};

Tacticode.Map.prototype.loadFromData = function (data) {
    this.name = data.name;
    this.size = {
        x: data.x,
        y: data.y,
    }
    this.offset = {
        x: Tacticode.GAME_WIDTH / 2,
        y: Tacticode.GAME_WIDTH / 4,
    }
    this.background = data.background;
    this.grounds = data.grounds || [];
    this.cells = data.cells || [];
    this.shadows = data.shadows;
    
    this._createGrounds();
    this._createSprites();
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

Tacticode.Map.prototype._createSprites = function () {
    this.container = new PIXI.Container();
    if (this.background) {
        var background = new PIXI.Sprite(PIXI.Texture.fromImage("assets/textures/" + this.background));
        this.container.addChild(background);
    }
    this.cells.sort(compareCells);
    for (var i = 0; i < this.cells.length; ++i) {
        var cellData = this.cells[i];
            
        if (cellData.tile !== 0) {
            var tile = new PIXI.Sprite(Tacticode.tiles[cellData.tile - 1]);
            tile.anchor.x = 0.5;
            tile.anchor.y = 0.5;
                
            var coords = mapToProjection(cellData.x, cellData.y, cellData.z);
            tile.position.x = coords[0] + Tacticode.GAME_WIDTH / 2;
            tile.position.y = coords[1] + Tacticode.GAME_HEIGHT / 4;
                
            var darkness = 0xFF - cellData.z * 15;
            if (cellData.z == 0 && this.containsCell(cellData.x, cellData.y - 1, cellData.z + 1)) {
                darkness -= 0x50;
            }
            tile.tint = (darkness << 16) + (darkness << 8) + darkness;
            
            cellData.sprite = tile;
            this.container.addChild(tile);
        }
    }
};

Tacticode.Map.prototype._createGrounds = function () {
    for (var i = 0; i < this.grounds.length; ++i) {
        var ground = this.grounds[i];
        for (var mapX = 0; mapX < this.size.x; ++mapX) {
            for (var mapY = 0; mapY < this.size.y; ++mapY) {
                if (!this.containsCell(mapX, mapY, ground.z)) { 
                    this.cells.push({
                        x: mapX,
                        y: mapY,
                        z: ground.z,
                        tile: ground.tile
                    });
                }
            }
        }
    }
};

// TODO trier les trois fonctions suivantes : 

function compareCells(a, b) {
    if (a.z !== b.z) return (a.z - b.z);
    if (a.y !== b.y) return (a.y - b.y);
    return a.x - b.x;
}

function mapToProjection(x, y, z) {
    return [
        (x - y) * Tacticode.CELL_WIDTH_HALF,
        (x + y - z * 2) * Tacticode.CELL_HEIGHT_HALF
    ];
}

function projectionToMap(x, y) {
    x /= Tacticode.CELL_WIDTH_HALF;
    y /= Tacticode.CELL_HEIGHT_HALF;
    return [
        Math.ceil((x + y) / 2),
        Math.ceil((y - x) / 2)
    ];
}
