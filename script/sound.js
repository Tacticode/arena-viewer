'use strict';

/**
 * Creates a new SoundManager, used to register and play sound effects.
 * @constructor
 * @param {string} basePath Path concatenated to individual filenames.
 */
var SoundManager = function (basePath) {
	this.basePath = basePath;
	this.sounds = {};
	this.isMuted = false;
};

/**
 * Registers the specified audio element, so that it can be played later.
 * @param {string} name Name of the sound effect, used by the play() function.
 * @param {string} path Path to the audio file. Will be concatenated with the base path.
 * @param {number} number Amount of audio elements to register. This allows the sound to be played more than once at the same time.
 */
SoundManager.prototype.register = function (name, path, number) {
	number = (number !== undefined) ? number : 1;
	this.sounds[name] = new Sound(this.basePath + path, number);
};

/**
 * Plays the previously registered sound effect.
 * @param {string} name Name of the audio sound, as specified in the register() function.
 */
SoundManager.prototype.play = function (name) {
	if (!this.isMuted) {
		this.sounds[name].play();
	}
};

/**
 * Represents a sound effect. Will register as many Audio element as required.
 * @constructor
 * @param {string} path Path to the audio file.
 * @param {number} number Amount of audio elements to register.
 */
var Sound = function (path, number) {
	this.audios = [];
	for (var i = 0; i < number; ++i) {
		var audio = new Audio(path);
		this.audios.push(audio);
	}
};

/**
 * Plays this sound effect using the first available audio element.
 */
Sound.prototype.play = function () {
	for (var i = 0; i < this.audios.length; ++i) {
		if (this.audios[i].paused) {
			this.audios[i].play();
			break;
		}
	}
};
