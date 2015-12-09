var Tacticode = {
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 768,
    CELL_WIDTH_HALF: 32,
    CELL_HEIGHT_HALF: 16,
    tiles: []
};

Tacticode.init = function () {
	Tacticode.stage = new PIXI.Container();
	Tacticode.renderer = new PIXI.autoDetectRenderer(1024, 768);
	Tacticode.projectiles = new ProjectilesAnimator(Tacticode.stage);
	document.body.appendChild(Tacticode.renderer.view);

    Tacticode.loadTiles();

    requestAnimationFrame(Tacticode.animate);
};

Tacticode.animate = function () {
    requestAnimationFrame(Tacticode.animate);
	Tacticode.projectiles.animate();
    Tacticode.renderer.render(Tacticode.stage);
}

Tacticode.loadTiles = function () {
    for (var i = 1; i <= 101; ++i) {
        var name = "assets/sprites/tile";
        if (i < 100) name += "0";
        if (i < 10) name += "0";
        name += i + ".png";
        Tacticode.tiles.push(PIXI.Texture.fromImage(name))
    }
};

Tacticode.testTexture = PIXI.Texture.fromImage("assets/test/test.png");

