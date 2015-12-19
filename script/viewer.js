/**
 * Tacticode - Viewer
 * Main file of the project, contains the jQuery entrypoint.
 */

$(function () {
    Tacticode.init();
    
    var map = new Tacticode.Map();
	
	map.loadFromData(Tacticode.maps.sample);
		
	Tacticode.stage.addChild(map.container);
});
