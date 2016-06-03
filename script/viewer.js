/**
 * Tacticode - Viewer
 * Main file of the project, contains the jQuery entrypoint.
 */

var fight = {
	"map": "sample",
	"entities": [
		{"id": 0, "x": 1, "y": 2, "breed": "orc", "team": 0, "health": 1000, "weapon": "staff1"},
		{"id": 1, "x": 1, "y": 3, "breed": "orc", "team": 0, "health": 800},
		{"id": 2, "x": 6, "y": 4, "breed": "elf", "team": 1, "health": 600, "weapon": "bow1"}
	],
	"actions" : [
		{"type": "move", "entity": 1, "x": 2, "y": 3},
		{"type": "move", "entity": 1, "x": 2, "y": 4},
		{"type": "skill", "entity": 0, "skill": "fireball", "x": 6, "y": 4},
		{"type": "heal", "entity": 0, "health": 51},
		{"type": "damage", "entity": 2, "health": 51},

		{"type": "move", "entity": 2, "x": 6, "y": 5},
		{"type": "skill", "entity": 2, "skill": "arrow", "x": 2, "y": 4},
		{"type": "damage", "entity": 1, "health": 179},
		{"type": "heal", "entity": 2, "health": 179},
		
		{"type": "move", "entity": 2, "x": 6, "y": 6},
		{"type": "skill", "entity": 2, "skill": "arrow", "x": 5, "y": 0},
		{"type": "move", "entity": 2, "x": 5, "y": 6},
		{"type": "skill", "entity": 2, "skill": "arrow", "x": 4, "y": 12},
		
		{"type": "skill", "entity": 2, "skill": "iceball", "x": 1, "y": 2},
		{"type": "damage", "entity": 0, "health": 617},
		{"type": "skill", "entity": 2, "skill": "iceball", "x": 1, "y": 2},
		{"type": "damage", "entity": 0, "health": 434},
		{"type": "death", "entity": 0},
		{"type": "move", "entity": 2, "x": 5, "y": 5},
	]
};

$(function () {
    Tacticode.init("tacticode-viewer-container");
	Tacticode.loadFight(fight);
});
