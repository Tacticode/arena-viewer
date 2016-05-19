'use strict';

var SoundManager = function (basePath) {
	this.basePath = basePath;
	this.sounds = {};
};

SoundManager.prototype.register = function (name, path, number) {
	number = (number !== undefined) ? number : 1;
	this.sounds[name] = new Sound(this.basePath + path, number);
};

SoundManager.prototype.play = function (name) {
	this.sounds[name].play();
};

var Sound = function (path, number) {
	this.audios = [];
	for (var i = 0; i < number; ++i) {
		var audio = new Audio(path);
		this.audios.push(audio);
	}
};

Sound.prototype.play = function () {
	for (var i = 0; i < this.audios.length; ++i) {
		if (this.audios[i].paused) {
			this.audios[i].play();
			break;
		}
	}
};
