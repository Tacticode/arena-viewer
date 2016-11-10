/**
 * Tacticode - Entity Part
 */

"use strict"

/**
 * Class EntityPart
 * @constructor
 */
Tacticode.CustomTexture.EntityPart = function(path, type, scale = 3/4){
	this.path = path;
	this.type = type;
	this.scale = scale;
}

/**
 * Entity types constants
 */
Tacticode.CustomTexture.EntityPart.types = {
	IS_MIRRORED: 1, // nw and sw images are mirrored to make the ne and se images
	SINGLE_IMAGE: 2, // all directions and animations are made from 1 image
	FRONT_ONLY: 4, // visible only when the character is looking s
	BACK_ONLY: 8, // visible only when the character is looking n
	NO_ANIM: 16, // use same image for all animations
	NO_STAND: 32, // part ignored in stand frames
	NO_ATTACK: 64 // part ignored in attack frames
}

{	
	let types = Tacticode.CustomTexture.EntityPart.types;
	
	Tacticode.CustomTexture.EntityPart.parts = {
		body1: new Tacticode.CustomTexture.EntityPart("sprites/character/body/body1",
			types.IS_MIRRORED),
		eyes1: new Tacticode.CustomTexture.EntityPart("sprites/character/body/eyes1",
			types.IS_MIRRORED | types.SINGLE_IMAGE | types.FRONT_ONLY | types.NO_ANIM),
		face1: new Tacticode.CustomTexture.EntityPart("sprites/character/body/face1",
			types.IS_MIRRORED | types.SINGLE_IMAGE | types.FRONT_ONLY | types.NO_ANIM),
		face2: new Tacticode.CustomTexture.EntityPart("sprites/character/body/face2",
			types.IS_MIRRORED | types.SINGLE_IMAGE | types.FRONT_ONLY | types.NO_ANIM),
		hair1: new Tacticode.CustomTexture.EntityPart("sprites/character/body/hair1",
			types.IS_MIRRORED | types.NO_ANIM),
		hair2: new Tacticode.CustomTexture.EntityPart("sprites/character/body/hair2",
			types.IS_MIRRORED | types.NO_ANIM),
		hair3: new Tacticode.CustomTexture.EntityPart("sprites/character/body/hair3",
			types.IS_MIRRORED | types.NO_ANIM),
		clothes1: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/clothes1",
			types.IS_MIRRORED | types.NO_ANIM),
		clothes2: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/clothes2",
			types.IS_MIRRORED | types.NO_ANIM),
		armor1: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/armor1",
			types.IS_MIRRORED | types.NO_ANIM),
		armor2: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/armor2",
			types.IS_MIRRORED | types.NO_ANIM),
		boots1: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/boots1",
			types.IS_MIRRORED | types.NO_ANIM),
		hat1: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/hat1",
			types.SINGLE_IMAGE),
		sword1: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/sword1",
			types.IS_MIRRORED),
		bow1: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/bow1",
			types.IS_MIRRORED),
		staff1: new Tacticode.CustomTexture.EntityPart("sprites/character/equipment/staff1",
			types.IS_MIRRORED)
	}
	
	let parts = Tacticode.CustomTexture.EntityPart.parts;
	
	Tacticode.CustomTexture.EntityPart.breedData = {
		orc: {
			body: parts.body1,
			eyes: parts.eyes1,
			hair: [parts.hair1, parts.hair2, parts.hair3],
			clothes: [[parts.clothes1, parts.clothes2],
				[parts.clothes1]],
			clothesColors: Tacticode.CustomTexture.randomColor,
			armor: [parts.armor1, parts.armor2, null],
			armorColors: [0xb0a090, 0x606050, 0x806000, 0xffd700],
			boots: parts.boots1,
			bootColors: [0x704010, 0x403030, 0x908080],
			skinColors: [0x20d030, 0x209020, 0x70b020, 0x3090d0],
			hairColors: [0xc7c7c7, 0x666666, 0x040201, 0x4c200a, 0x892f1a, 0x895e1a, 0xe5c11f],
			eyesColors: [0xf31a12, 0x500502],
			face: parts.face2
		},
		human: {
			body: parts.body1,
			eyes: parts.eyes1,
			hair: [parts.hair1, parts.hair2, parts.hair3],
			clothes: [[parts.clothes1, parts.clothes2]],
			clothesColors: Tacticode.CustomTexture.randomColor,
			armor: [parts.armor1, parts.armor2],
			armorColors: [0xb0a090, 0x606050, 0x806000, 0xffd700],
			boots: parts.boots1,
			bootColors: [0x704010, 0x403030, 0x908080],
			skinColors: [0xf0e0b0, 0xf0e0c0, 0xf8e887, 0xaa7a08, 0x6a4c06, 0xd7d379],
			hairColors: [0xc7c7c7, 0x666666, 0x040201, 0x4c200a, 0x892f1a, 0x895e1a, 0xe5c11f],
			eyesColors: [0x135ca0, 0x22dd62, 0x7e4220],
			face: parts.face1
		}
	}
}
