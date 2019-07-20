
var IDE_HOOK = false;
var VERSION = '0.1.0';
var isDebugAll = false;
var isDisableEnemies = true;

var wc = {
	window: {
		w: window.innerWidth - 2,
		h: window.innerHeight - 4
	},
	player: {
		speedXY: 300
	}
};

var game = new Phaser.Game(wc.window.w, wc.window.h, Phaser.CANVAS, 'game-canvas', {preload: preload, create: create, update: update, render: render });


var arsenal = {
	rack: {
		/* 
		 * The following fields are created automatically on init().
		 * ID: 				"KEY" (Set using rack.key.)
		 * toolImageFile: 	"tool.KEY.svg"
		 * slotImageFile: 	"tool.KEY.icon.svg"
		 * bulletImageFile: "tool.KEY.bullet.svg"
		 * soundFile: 		"tool.KEY.mp3"
		 * wepp:			Created as an object by Phaser.
		 * weaponGripOffset:This only gets set if not specified.
		 * 					EG: weaponGripOffset: xy(5, -30)
		 */
		revolver: {
			iReloadMs: 400, // Time in miliseconds between shots.
			bulletAngleVariance: 5,
			bulletSpeed: 700,
			damage: 0.2,
			wepp:null
		},
		laser: {
			iReloadMs: 200, // Time in miliseconds between shots.
			bulletAngleVariance: 0,
			bulletSpeed: 1400,
			damage: 0.7,
			wepp:null
		},
		bow: {
			iReloadMs: 0, // Time in miliseconds between shots.
			bulletAngleVariance: 3,
			bulletSpeed: 500,
			weaponGripOffset: xy(5, -30),
			spriteFrame: 7,
			chargeEmpty: 30,
			chargeFull: 10,
			damage: 0.4,
			wepp:null
		}
	},
	init: function(theGame) {
		for (var sWeaponKey in arsenal.rack) {
			var weaponTemp = arsenal.rack[sWeaponKey];
			weaponTemp.id = sWeaponKey;
			weaponTemp.wepp = theGame.plugins.add(Phaser.Weapon);
			weaponTemp.wepp.createBullets(100, sWeaponKey + 'Bullet');
			// The bullet will be automatically killed when it leaves the world bounds
			weaponTemp.wepp.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
			// The speed at which the bullet is fired
			weaponTemp.wepp.bulletSpeed = weaponTemp.bulletSpeed;
			// Weapon tracks the 'player' with offsets relative to player.
			// The 'true' argument tells the weapon to track sprite rotation
			weaponTemp.wepp.trackSprite(player, 50, 0, true);
			weaponTemp.wepp.fireRate = weaponTemp.iReloadMs;
			weaponTemp.wepp.bulletAngleVariance = weaponTemp.bulletAngleVariance; // Spray bullets a bit.
			// Sound
			weaponTemp.sound = game.add.audio(sWeaponKey + 'Sound');
		}
	},
	preloadWeapons: function() {
		for (sWeaponKey in arsenal.rack) {
			var weaponTemp = arsenal.rack[sWeaponKey];
			
			/* Fill in some code-by-convention fields. */
			weaponTemp.toolImageFile = "tool." + sWeaponKey + ".svg",
			weaponTemp.slotImageFile = "tool." + sWeaponKey + ".icon.svg",
			weaponTemp.bulletImageFile = "tool." + sWeaponKey + ".bullet.svg",
			weaponTemp.soundFile = "tool." + sWeaponKey + ".mp3",
			weaponTemp.weaponGripOffset = util.getSafe(weaponTemp.weaponGripOffset, xy(0,0));
			weaponTemp.spriteFrame = util.getSafe(weaponTemp.spriteFrame, 5);

			game.load.image(sWeaponKey, '../img/' + weaponTemp.toolImageFile)
			game.load.image(sWeaponKey + 'Bullet', '../img/' + weaponTemp.bulletImageFile);
			game.load.audio(sWeaponKey + 'Sound', '../snd/' + weaponTemp.soundFile);
		}
	},
	convertPcToArrowCharge: function(iPc) {
		var b = arsenal.rack.bow
		var iRangePx = b.chargeEmpty - b.chargeFull;
		var fMovePx = iRangePx * iPc / 100
		return b.chargeEmpty - fMovePx;
	}
}

function preload() {

	document.title = "WarCargo " + VERSION;

	game.load.tilemap('levelGround', '../data/levelGround.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles-ground', '../img/tiles-ground.png');
	game.load.tilemap('levelSky', '../data/levelSky.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles-sky', '../img/tiles-sky.png');
	game.load.spritesheet('player', '../img/mob.player.sprite.svg', 80, 80);
	game.load.image('bgGrass', '../img/bgGrass.png');
	game.load.image('bgWater', '../img/bgWater.png');
	game.load.image('bacon', '../img/food.bacon.svg');
	game.load.image('wood', '../img/food.wood.svg');
	game.load.spritesheet('ogre', '../img/mob.wampa.sprite.svg', 80, 80)
	
	// TODO Prefer to have this as an image. See if round hitbox still works.
	//game.load.image('tree', '../img/prop.tree.png');
	game.load.spritesheet('tree', '../img/prop.tree.png', 160, 160);
	// END TODO
	
	if (Math.random() <= 0.4) {
		game.load.spritesheet('ogre', '../img/mob.clown.sprite.svg', 80, 80)
	} else if (Math.random() <= 0.8) {
		game.load.spritesheet('ogre', '../img/mob.wampa.sprite.svg', 80, 80)
	} else {
		game.load.spritesheet('ogre', '../img/mob.ogre.sprite.png', 100, 100)
	}

	// Weapons
	arsenal.preloadWeapons();

	// Scoreboard
	game.load.image('bgScoreboard', '../img/bgScoreboard.png');

}

var mapGround;
var mapSky;
var tileset;
var layerGround;
var layerSky;
var player;
var otherPlayers;
var food;
var trees;
var tools;
var jumpTimer = 0;
var cursors;
var bgGrass;
var ogre;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#3D5942';

	var iBgW = (wc.window.h * 2) + 200;
	var iBgH = (wc.window.h * 2) + 200;
	var iBgW = 64 * 64;
	var iBgH = iBgW;
	bgGrass = game.add.tileSprite(0, 0, iBgW, iBgH, 'bgGrass');
	bgGrass.fixedToCamera = false;

	// Maps and layers #########################################
	// Map Ground
	mapGround = game.add.tilemap('levelGround');
	mapGround.addTilesetImage('tiles-ground');
	mapGround.setCollisionByExclusion([ 1, 2, 3, 7, 8, 9, 10, 11, 12, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27]);
	layerGround = mapGround.createLayer('Tile Layer Ground');
	// Un-comment this on to see the collision tiles.
	//layerGround.debug = true;

	// Un-comment this on to see the collision tiles.
	//layerSky.debug = true;

	layerGround.resizeWorld();
	// End maps and layers #########################################

	/*
	Add Bacon
	*/
	food = game.add.group();
	var axyPos = [
		xy(game.world.centerX - 250, game.world.centerY - 60)
		,xy(game.world.centerX - 220, game.world.centerY - 42)
		,xy(game.world.centerX - 200, game.world.centerY - 32)
		,xy(4 * 64, 17 * 64)
		,xy(22 * 64, 1 * 64)
		,xy(40 * 64, 6 * 64)
		,xy((32.5 * 64), 40 * 64)
		,xy(1 * 64, 1 * 64)
		,xy(1 * 64, 30 * 64)
		,xy((30.5 * 64), 31 * 64)
		,xy((27.5 * 64), 29 * 64)
		,xy(2 * 64, 4 * 64)
	];
	for (var iB = 0; iB < axyPos.length; iB++) {
		//  This creates a new Phaser.Sprite instance within the group
		var baconToAdd = food.create(axyPos[iB].x, axyPos[iB].y, 'bacon');
		game.physics.enable(baconToAdd, Phaser.Physics.ARCADE);
	}

	for (var iB = 0; iB < axyPos.length; iB++) {
		//  This creates a new Phaser.Sprite instance within the group.
		var iX = axyPos[iB].x + 100;
		var iY = axyPos[iB].y - 50;
		var woodToAdd = food.create(iX, iY, 'wood');
		game.physics.enable(woodToAdd, Phaser.Physics.ARCADE);
	}

	tools = game.add.group();
	//var handgunToAdd = tools.create(game.world.centerX + 150, game.world.centerY, 'handgun');
	var revolverToAdd = tools.create(game.world.centerX + 200, game.world.centerY, 'revolver');
	game.physics.enable(revolverToAdd, Phaser.Physics.ARCADE);

	var laserToAdd = tools.create(game.world.centerX - 150, game.world.centerY, 'laser');
	game.physics.enable(laserToAdd, Phaser.Physics.ARCADE);
	
	var bowToAdd = tools.create(game.world.centerX - 100, game.world.centerY, 'bow');
	game.physics.enable(bowToAdd, Phaser.Physics.ARCADE);

	
	/* 
	 * This bit is very special.
	 * Create the otherPlayer group, but they are not loaded straight away.
	 * A call is made to fireBase, and when it returns, load others from the 
	 * added list.
	 */
	otherPlayers = game.add.group();
	
	/* Player */
	player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	player.anchor.setTo(0.39, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	
	/* Ogre */
	ogre = game.add.sprite(game.world.centerX + 500, game.world.centerY + 700, 'ogre');
	ogre.anchor.setTo(0.39, 0.5);
	game.physics.enable(ogre, Phaser.Physics.ARCADE);
	
	player.body.bounce.y = 0; // was 0.2
	player.body.collideWorldBounds = true;
	player.body.setCircle(30, 0, 10);

	player.animations.add('act', [1, 2, 2, 3, 0, 0], 10, true);
	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();
	// TODO reallocate:: spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Weapon stuff Start -------------------------------------------------------
	arsenal.init(this.game);

	scoreboard.init(this);
	mainMenu.init();
	gameController.pauseGame();
	
	trees = game.add.group();
	var iXT = iYT = 1600;
	//var 
	treeToAdd = trees.create(iXT, iYT, 'tree')
	treeToAdd.anchor.setTo(0.5, 0.5);
	game.physics.enable(treeToAdd, Phaser.Physics.ARCADE);
	//treeToAdd.body.setSize(100, 100, 10, 10);
	treeToAdd.body.setCircle(50, 15, 15);
	treeToAdd.body.immovable = true;
	game.debug.body(treeToAdd);

	// Map Sky
	mapSky = game.add.tilemap('levelSky');
	mapSky.addTilesetImage('tiles-sky');
	//mapSky.setCollisionByExclusion([ 1, 2, 3, 7, 8, 9, 10, 11, 12, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27]);
	layerSky = mapSky.createLayer('Tile Layer Sky');
	//layerSky.scrollFactorX = 1.05;
	//layerSky.scrollFactorY = 1.05;
	//layerSky.alpha = 0.5
	
}

/**
 * Called when the player collides with (collects) some food.
 */
function foodCollisionHandler (player, item) {
	item.kill();
	if (item.key == "bacon") {
		scoreboard.points.add(100);
		scoreboard.points.add(100);
		scoreboard.slots.bacon.add();
	} else {
		scoreboard.health.add(10);
		scoreboard.slots.wood.add();
	}
}

function treesCollisionHandler(player, item) {
}

function toolsCollisionHandler (player, item) {
	item.kill();
	var oWeaponInfo = arsenal.rack[item.key];
	var oSlotNew = scoreboard.createNewSlot().init(oWeaponInfo);
	oSlotNew.digit.style.display = "none";
	oSlotNew.add();
	oSlotNew.uiOuter.onclick = function() {
		playerStatus.toggleOrPickUpItem(item.key);
	};
	playerStatus.toggleOrPickUpItem(item.key);
}

function bulletsFoodCollisionHandler (bullet, item) {
	item.kill();
	bullet.kill();
	//playerStatus.pickUpItem(item);
}

function playerOgreCollisionHandler (player, ogre) {
	if (!playerStatus.isJustGotHit) {
		player.frame = 6;
		playerStatus.isJustGotHit = true;
		scoreboard.health.add(-10);
		setTimeout(
			function(){
				if (playerStatus.hasTool) {
					player.frame = playerStatus.selectedWeapon.spriteFrame;
				}
				playerStatus.isJustGotHit = false;
			},
			enemyStatus.knockbackDurationMs
		)
	}
}

function bulletOgreCollisionHandler (ogre, bullet) {
	enemyStatus.chaseSpeed  = 0;
	ogre.frame = enemyStatus.frameDead;
	setTimeout(
		// This sets the sprite to the Dead frame for a second.
		function() {
			if (scoreboard.ogres > 3) {
				ogre.kill();
			} else {
				ogre.position = {x: 20, y: 20, type: 25};
				ogre.frame = 1;
				scoreboard.ogres++;
			}
			enemyStatus.chaseSpeed  = enemyStatus.chaseSpeedDefault;
		},
		1000
	)
	bullet.kill();
	
}

function update() {

	/* Player v food */
	game.physics.arcade.collide(player, food, foodCollisionHandler);

	/* Player v ogre */
	game.physics.arcade.collide(player, ogre, playerOgreCollisionHandler);
	
	/* player v tool */
	game.physics.arcade.collide(player, tools, toolsCollisionHandler);

	/* player v tree */
	game.physics.arcade.collide(player, trees, treesCollisionHandler);

	if (playerStatus.hasTool) {
		/* Bullet v food */
		game.physics.arcade.collide(playerStatus.selectedWeapon.wepp.bullets, food, bulletsFoodCollisionHandler);
		/* Bullet v ogre */
		game.physics.arcade.collide(playerStatus.selectedWeapon.wepp.bullets, ogre, bulletOgreCollisionHandler);
	}
	
	game.physics.arcade.collide(player, layerGround); // layerSky does not have a collision.
	player.rotation = game.physics.arcade.angleToPointer(player); // + 1.57;
	
	if (cursors.up.isDown) {
		player.body.velocity.y = -wc.player.speedXY;
	} else if (cursors.down.isDown) {
		player.body.velocity.y = wc.player.speedXY;
	} else {
		player.body.velocity.y = 0;
	}

	if (cursors.left.isDown) {
		player.body.velocity.x = -wc.player.speedXY;
	} else if (cursors.right.isDown) {
		player.body.velocity.x = wc.player.speedXY;
	} else {
		player.body.velocity.x = 0;
	}

	if (playerStatus.hasTool) {
		if (playerStatus.selectedWeapon.id == "bow"){
			if (game.input.activePointer.isDown) {
				if (iWeaponChargePc == 0) {
					var handBullet = game.add.sprite(
						28,
						-5,
						'bowBullet'
					);
					player.bulletInHand = player.addChild(handBullet);
					iWeaponChargePc++;
				} else if (iWeaponChargePc < 100) {
					iWeaponChargePc++;
				}
				player.bulletInHand.position.x = arsenal.convertPcToArrowCharge(iWeaponChargePc);
				
			} else {
				// mouse not down
				if (iWeaponChargePc > 0) {
					player.bulletInHand.kill();
				}
				//if the weapon charge percent is greater than 50:
				if (iWeaponChargePc > 50) {
					playerStatus.selectedWeapon.wepp.fire();
				}
				iWeaponChargePc = 0;
			}
		} else {
			
			// SHOOT SHOOT SHOOOOT!
			if (game.input.activePointer.isDown) {
				playerStatus.selectedWeapon.wepp.fire();
				if (!playerStatus.isReloading) {
					playerStatus.isReloading = true;
					setTimeout(
						function() {
							playerStatus.isReloading = false;
						},
						playerStatus.selectedWeapon.iReloadMs
					);
					playerStatus.selectedWeapon.sound.play();
				}
			}
		}
	} else if (game.input.activePointer.isDown) {
		player.animations.play('act');
	} else {
		player.animations.stop();
		player.frame = playerStatus.isJustGotHit ? 6 : 0;
	}

	/* This makes the knoekback work. */
	if (playerStatus.isJustGotHit) {
		game.physics.arcade.moveToObject(player, ogre, enemyStatus.knockbackSpeed);
	} else {
		ogre.rotation = game.physics.arcade.moveToObject(ogre, player, enemyStatus.chaseSpeed)
	}
	firestoreManager.syncUiToFirestoreData(player, scoreboard.points.count);
	//console.log("op c l :: " + otherPlayers.children.length);
	for (var iOP = 0; iOP < otherPlayers.children.length; iOP++) {
		var op = otherPlayers.children[iOP];
		var oChanges = firestoreManager.changeDict[op.data.fbId];
		if (oChanges != null) {
			//debugger;
			if (oChanges.hasOwnProperty("kill")) {
				op.destroy();
			} else {
				op.position = {x: oChanges.x, y: oChanges.y};
				op.rotation = oChanges.rotation * 0.0174532;
				console.log("op rot :: " + op.rotation);
			}
		}
		//debugger;
	}
}

var iWeaponChargePc = 0;

var enemyStatus = {
	knockbackDurationMs: 100,
	chaseSpeed: 0,
	chaseSpeedDefault: ((isDebugAll || isDisableEnemies) ? 0 : 200),
	knockbackSpeed: -400,
	frameDead: 2
}

var playerStatus = {
	selectedWeapon: null,
	hasTool: false, // Does player have any tool in hand?
	isReloading: false, // Are we reloading next bullet?
	isJustGotHit: false,
	pickUpItem: function(itemKey) {
		playerStatus.selectedWeapon = arsenal.rack[itemKey];
		this.hasTool = true;
		var handWeapon = game.add.sprite(
			20 + playerStatus.selectedWeapon.weaponGripOffset.x,
			-5 + playerStatus.selectedWeapon.weaponGripOffset.y,
			itemKey
		);
		player.weaponInHand = player.addChild(handWeapon);
		player.frame = playerStatus.selectedWeapon.spriteFrame;
	},
	toggleOrPickUpItem: function(itemKey) {
		// Always put down currently selected weapon if he has one.
		if (playerStatus.hasTool) {
			playerStatus.hasTool = false;
			player.weaponInHand.kill();
			player.frame = 0;
		}
		if (
			(playerStatus.selectedWeapon == null)
			|| (playerStatus.selectedWeapon.id != itemKey)
		) {
			// Clicked on different weapon. Pick it up.
			playerStatus.pickUpItem(itemKey);
		}
	}

}

function render () {
	if (isDebugAll) {
		game.debug.text(game.time.physicsElapsed, 32, 32);
		game.debug.body(player);
		game.debug.bodyInfo(player, 16, 24);
	}
}
