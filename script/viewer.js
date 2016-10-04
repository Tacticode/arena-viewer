/**
 * Tacticode - Viewer
 * Main file of the project, contains the jQuery entrypoint.
 */

var fight = {
	"map":
{
    "name": "Forest",
    "style": "basic",
    "width": 10,
    "height": 10,
    "cells" : [
        {"x": 0, "y": 0, "z": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 0, "y": 1, "z": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 0, "y": 2, "z": 2, "tile": "TREE", "accessible": false, "los": false},
        {"x": 0, "y": 3, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 0, "y": 4, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 0, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 0, "y": 6, "z": 3, "tile": "TREE", "accessible": false, "los": false},
        {"x": 0, "y": 7, "z": 3, "tile": "TREE", "accessible": false, "los": false},
        {"x": 0, "y": 8, "z": 2, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 0, "y": 9, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 1, "y": 0, "z": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 1, "y": 1, "z": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 1, "y": 2, "z": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 1, "y": 3, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 1, "y": 4, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 1, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 1, "y": 6, "z": 1, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 1, "y": 7, "z": 1, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 1, "y": 8, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 1, "y": 9, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 2, "y": 0, "z": 2, "tile": "TREE", "accessible": false, "los": false},
        {"x": 2, "y": 1, "z": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 2, "y": 2, "z": 2, "tile": "CRATE", "accessible": true, "los": true},
        {"x": 2, "y": 3, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 2, "y": 4, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 2, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 2, "y": 6, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 2, "y": 7, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 2, "y": 8, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 2, "y": 9, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 3, "y": 0, "z": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 3, "y": 1, "z": 1, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 3, "y": 2, "z": 1, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 3, "y": 3, "z": 1, "tile": "CRATE", "accessible": true, "los": true},
        {"x": 3, "y": 4, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 3, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 3, "y": 6, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 3, "y": 7, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 3, "y": 8, "z": 1, "tile": "CRATE", "accessible": true, "los": true},
        {"x": 3, "y": 9, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 4, "y": 0, "z": 2, "tile": "TREE", "accessible": false, "los": false},
        {"x": 4, "y": 1, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 4, "y": 2, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 4, "y": 3, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 4, "y": 4, "tile": "DIRT", "accessible": true, "los": true},
        {"x": 4, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 4, "y": 6, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 4, "y": 7, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 4, "y": 8, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 4, "y": 9, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 5, "y": 0, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 5, "y": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 5, "y": 2, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 5, "y": 3, "z": 1, "tile": "CRATE", "accessible": true, "los": true},
        {"x": 5, "y": 4, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 5, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 5, "y": 6, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 5, "y": 7, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 5, "y": 8, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 5, "y": 9, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 6, "y": 0, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 6, "y": 1, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 6, "y": 2, "z": 1, "tile": "CRATE", "accessible": true, "los": true},
        {"x": 6, "y": 3, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 6, "y": 4, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 6, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 6, "y": 6, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 6, "y": 7, "z": 1, "tile": "CRATE", "accessible": true, "los": true},
        {"x": 6, "y": 8, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 6, "y": 9, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 7, "y": 0, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 7, "y": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 7, "y": 2, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 7, "y": 3, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 7, "y": 4, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 7, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 7, "y": 6, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 7, "y": 7, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 7, "y": 8, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 7, "y": 9, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 8, "y": 0, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 2, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 3, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 4, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 6, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 7, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 8, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 8, "y": 9, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 9, "y": 0, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 9, "y": 1, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 9, "y": 2, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 9, "y": 3, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 9, "y": 4, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 9, "y": 5, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 9, "y": 6, "z": 1, "tile": "TREE", "accessible": false, "los": false},
        {"x": 9, "y": 7, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 9, "y": 8, "tile": "GROUND", "accessible": true, "los": true},
        {"x": 9, "y": 9, "z": 1, "tile": "TREE", "accessible": false, "los": false}
    ],
    "start_positions": [
        {
            "x": 1,
            "y": 1
        },
        {
            "x": 4,
            "y": 1
        },
        {
            "x": 8,
            "y": 1
        },
        {
            "x": 3,
            "y": 2
        },
        {
            "x": 5,
            "y": 2
        },
        {
            "x": 1,
            "y": 8
        },
        {
            "x": 4,
            "y": 8
        },
        {
            "x": 8,
            "y": 8
        },
        {
            "x": 3,
            "y": 7
        },
        {
            "x": 5,
            "y": 7
        }
    ]
},
	"entities": [
		{"id": 957, "x": 1, "y": 2, "breed": "orc", "team": 1, "name":"Murbag", "health": 1000, "weapon": "staff1"},
		{"id": 22, "x": 1, "y": 3, "breed": "orc", "team": 0, "name":"Korgak", "health": 800},
		{"id": 2, "x": 4, "y": 2, "breed": "elf", "team": 0, "name":"Falael", "health": 600, "weapon": "bow1"}
	],
	"winner": 1,
	"actions" : [
		{"type": "newturn", "turn": 1},
		{"type": "move", "entity": 22, "x": 2, "y": 3},
		{"type": "move", "entity": 22, "x": 2, "y": 4},
		{"type": "skill", "entity": 957, "skill": "FIREBALL", "x": 4, "y": 2},
		{"type": "heal", "entity": 957, "health": 51},
		{"type": "damage", "entity": 2, "health": 51},

		{"type": "newturn", "turn": 2},
		{"type": "move", "entity": 2, "x": 4, "y": 3},
		{"type": "skill", "entity": 2, "skill": "nonexisting", "x": 4, "y": 3},
		{"type": "heal", "entity": 2, "health": 28817},
		{"type": "skill", "entity": 2, "skill": "ARROW", "x": 2, "y": 4},
		{"type": "damage", "entity": 22, "health": 179},
		{"type": "heal", "entity": 2, "health": 179},
		
		{"type": "newturn", "turn": 3},
		{"type": "move", "entity": 2, "x": 4, "y": 2},
		{"type": "skill", "entity": 2, "skill": "FIREBALL", "x": 0, "y": 4},
		{"type": "move", "entity": 2, "x": 4, "y": 1},
		{"type": "skill", "entity": 2, "skill": "FIREBALL", "x": 4, "y": 0},
		
		{"type": "newturn", "turn": 4},
		{"type": "skill", "entity": 2, "skill": "FIREBALL", "x": 1, "y": 2},
		{"type": "damage", "entity": 957, "health": 617},
		{"type": "skill", "entity": 2, "skill": "FIREBALL", "x": 1, "y": 2},
		{"type": "damage", "entity": 957, "health": 434},
		{"type": "death", "entity": 957},
		{"type": "move", "entity": 2, "x": 3, "y": 1},
	]
};

$(function () {
    Tacticode.init("tacticode-viewer-container");
	Tacticode.loadFight(fight);
});
