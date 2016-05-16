KickZero.Game = function(game){
};

KickZero.Game.prototype = {

    init: function() {
        
        this.PLAYER_XOFFSET = 50;
        this.BALL_INITIAL_XOFFSET = 400;
        this.CROSSHAIR_XOFFSET = 220;
        this.CROSSHAIR_SCALE = 2.5;
        this.ENEMY_VELOCITY_MAX_VARIANCE = 50;
        this.ENEMY_VELOCITY_BASE = 100;
        this.ENEMY_SCALE = 2;
        this.FLOOR_HEIGHT = 50;
    },

    create: function(){

        this.background = this.game.add.tileSprite(0,0, 3712,1536, 'default-background');
        this.resize();

        this.setupPlayer();
        this.setupBall();
        this.setupCrossHair();
        this.setupEnemies();

        this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spacebar.onDown.add(this.kick, this);

        this.gameTick = 0;
    },

    update: function(){

        this.background.tilePosition.x -=5;
        this.ball.angle += (this.ball.body.velocity.x / 20);

        // i assume 60fps, spawn enemy every 3 seconds
        if (this.gameTick % 180 == 0) {
            console.log('spawning enemy');
            this.spawnEnemies();
        }

        this.checkCollisions();

        this.gameTick++;
        //console.log('game tick is ' + this.gameTick);
    
    },

    resize: function(){
        this.background.scale.y=0.25;
        this.background.scale.x=0.25;
    },

    setupPlayer: function() {
        this.player = this.add.sprite(this.PLAYER_XOFFSET, 0, 'megaman');
        var playerYOffset = this.world.height - this.player.height - this.FLOOR_HEIGHT;
        this.player.position.y = playerYOffset;
        this.player.animations.add('walk');
        this.player.play('walk', 10, true);
        this.physics.arcade.enable(this.player);
        this.player.enableBody = true;
        this.player.physicsBodyType = Phaser.Physics.ARCADE;
    },

    setupBall: function() {
        this.ball = this.add.sprite(this.BALL_INITIAL_XOFFSET, 0, 'ball');
        // Offset is halved because anchor is set to center instead of top left corner
        var ballYOffset = this.world.height - this.ball.height/2.0 - this.FLOOR_HEIGHT;
        this.ball.position.y = ballYOffset;
        this.ball.anchor.setTo(0.5 , 0.5);
        this.physics.arcade.enable(this.ball);
        this.ball.enableBody = true;
        this.ball.physicsBodyType = Phaser.Physics.ARCADE;

        this.ball.body.velocity.x = -100;
    },

    setupCrossHair: function() {
        this.crosshair = this.add.sprite(this.CROSSHAIR_XOFFSET, 0, 'crosshair');
        this.crosshair.scale.setTo(this.CROSSHAIR_SCALE, this.CROSSHAIR_SCALE);
        var crosshairYOffset = this.ball.position.y;
        this.crosshair.position.y = crosshairYOffset;
        this.crosshair.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.crosshair);
        this.crosshair.enableBody = true;
        this.crosshair.physicsBodyType = Phaser.Physics.ARCADE;
    },

    setupEnemies: function() {
        // Setup sprite group for enemies
        this.enemies = this.add.group();
        this.physics.arcade.enable(this.enemies);
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
    },

    spawnEnemies: function() {
        // I am not sure when enemy will be released. this might be a memory leak?
        var enemy = this.enemies.create(this.world.width, 0, 'enemy');
        enemy.scale.setTo(this.ENEMY_SCALE, this.ENEMY_SCALE);
        var enemyYOffset = this.world.height - enemy.height - this.FLOOR_HEIGHT;
        enemy.position.y = enemyYOffset;
        enemy.body.velocity.x = - ((Math.random() * this.ENEMY_VELOCITY_MAX_VARIANCE) + this.ENEMY_VELOCITY_BASE);
        enemy.health = 3;
        enemy.animations.add('walk');
        enemy.play('walk', 10, true);
        // Need to add hp bar to enemy
    },

    checkCollisions: function() {
        // check if ball hit enemy
        this.physics.arcade.overlap(this.ball, this.enemies, this.ballHitEnemy, null, this);

        // check if ball hit player
        this.physics.arcade.overlap(this.ball, this.player, this.ballHitPlayer, null, this);

        // check if enemy hit player
        this.physics.arcade.overlap(this.enemies, this.player, this.enemyHitPlayer, null, this);
    },

    ballHitPlayer: function(ball, player) {
        console.log('ball hit player');

        //this.state.start('Menu');
    },

    enemyHitPlayer: function(enemy, player) {
        console.log('enemy hit player');

        this.state.remove('');
        this.state.start('Menu');
    },
    
    ballHitEnemy: function(ball, enemy) {
        console.log('ball hit enemy');

        this.ball.body.velocity.x = -200;
        enemy.kill();
    },

    kick: function() {
        console.log('kick ball');

        console.log(this);
        this.ball.body.velocity.x = 400;
    },
};