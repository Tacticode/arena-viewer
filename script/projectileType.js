/**
 * Tacticode - Projectile Type
 */

"use strict"

/**
 * Projectile types
 */
Tacticode.Projectile.Type = {
	FireParticle:{name:"FireParticle", speed:4,
            orientedTexture:false, texturePath:"effect/particle_fire.png",
			particleType:null},
	IceParticle:{name:"IceParticle", speed:3,
            orientedTexture:false, texturePath:"effect/particle_ice.png",
			particleType:null},
	HolyParticle:{name:"HolyParticle", speed:3,
            orientedTexture:false, texturePath:"effect/particle_holyhand.png",
			particleType:null},

    Hit:{name:"HIT", speed:15,
            orientedTexture:false, texturePath:null, particleType:null},
	Arrow:{name:"ARROW", speed:6,
            orientedTexture:true,
            texturePath:"effect/arrow.png", particleType:null},
	Snipe:{name:"SNIPE", speed:6,
            orientedTexture:true,
            texturePath:"effect/snipe.png", particleType:"FireParticle",
            particleDistance:30
    },
    GhostArrow:{name:"GHOST_ARROW", speed:6,
            orientedTexture:true,
            texturePath:"effect/ghostarrow.png", particleType:null},
	Fire:{name:"FIREBALL", speed:15,
            orientedTexture:false, texturePath:"effect/fireball.png",
			particleType:"FireParticle", particleDistance:75},
	Ice:{name:"ICEBALL", speed:8,
            orientedTexture:false, texturePath:"effect/iceball.png",
			particleType:"IceParticle", particleDistance:30},
    Meteor:{name:"METEOR", speed:12,
            orientedTexture:false, trajectory:"fall",
            texturePath:"effect/meteore.png", particleType:"FireParticle",
            particleDistance:100},
    HolyHand:{name:"HOLY_HAND", speed:4,
            orientedTexture:false, texturePath:"effect/holyhand.png",
			particleType:"HolyParticle", particleDistance:30},

    /*FireTrap:{name:"FIRE_TRAP"},

    Smash:{name:"SMASH"},

    Bladestorm:{name:"BLADESTORM"},

    ShieldBump:{name:"FIRE_TRAP"},

    ShieldBreak:{name:"FIRE_TRAP"}*/
}
