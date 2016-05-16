KickZero.Game = function(game){
};

KickZero.Game.prototype = {

    init: function() {
        
        this.ENEMY_VELOCITY_MAX_VARIANCE = 50;
        this.ENEMY_VELOCITY_BASE = 100;
        this.FLOOR_HEIGHT = 50;
    },

    create: function(){

        this.background = this.game.add.tileSprite(0,0, 3712,1536, 'default-background');
        this.resize();

        this.player = this.add.sprite(100, 0, 'megaman');
        var playerYOffset = this.world.height - this.player.height - this.FLOOR_HEIGHT;
        this.player.position.y = playerYOffset;
        this.player.animations.add('walk');
        this.player.play('walk', 10, true);

        this.ball = this.add.sprite(260, 0, 'ball');
        var ballYOffset = this.world.height - this.ball.height/2.0 - this.FLOOR_HEIGHT;
        this.ball.position.y = ballYOffset;
        this.ball.anchor.setTo(0.5 , 0.5);
        this.physics.arcade.enable(this.ball);
        this.ball.enableBody = true;
        this.ball.physicsBodyType = Phaser.Physics.ARCADE;

        this.setupEnemies();

        this.gameTick = 0;
    },

    update: function(){

        this.background.tilePosition.x -=5;
        this.ball.angle +=10;

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
        enemy.scale.setTo(2, 2);
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
        this.physics.arcade.overlap(this.ball, this.enemies, this.enemyHit, null, this);

        // check if enemy hit player
    },
    
    enemyHit: function(ball, enemy) {
        console.log('enemy hit');

        enemy.kill()
    },

    kick: function(){

    },
};