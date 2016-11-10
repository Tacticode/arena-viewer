/**
 * Tacticode - Projectile Type
 */

"use strict"

/**
 * Projectile types
 */
Tacticode.Projectile.Type = {
	FireParticle:{name:"FireParticle", speed:4, orientedTexture:false,
			texturePath:"effect/particle_fire.png",
			particleType:null},
	IceParticle:{name:"IceParticle", speed:3, orientedTexture:false,
			texturePath:"effect/particle_ice.png",
			particleType:null},
	
	Arrow:{name:"ARROW", speed:6, orientedTexture:true,
			texturePath:"effect/arrow.png",
			particleType:null},
	Fire:{name:"FIREBALL", speed:15, orientedTexture:false,
			texturePath:"effect/fireball.png",
			particleType:"FireParticle", particleDistance:75},
	Ice:{name:"ICEBALL", speed:8, orientedTexture:false,
			texturePath:"effect/iceball.png",
			particleType:"IceParticle", particleDistance:30}
}
