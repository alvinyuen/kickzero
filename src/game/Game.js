KickZero.Game = function(game){
};

KickZero.Game.prototype = {

    init: function() {
        
        this.ENEMY_VELOCITY_MAX_VARIANCE = 50;
        this.ENEMY_VELOCITY_BASE = 100;
    },

    create: function(){

        this.background = this.game.add.tileSprite(0,0, 3712,1536, 'default-background');
        this.resize();

        this.player = this.add.sprite(100, 200, 'megaman');
        this.player.animations.add('walk');
        this.player.play('walk', 10, true);
        this.ball = this.add.sprite(260, 330, 'ball');
        this.ball.anchor.setTo(0.5 , 0.5);

        this.setupEnemies();

        this.gameTick = 0;
    },

    update: function(){

        this.background.tilePosition.x -=5;
        this.ball.angle +=10;

        // i assume 60fps, spawn enemy every 3 seconds
        if (this.gameTick % 120 == 0) {
            console.log('spawning enemy');
            this.spawnEnemies();
        }

        this.checkCollisions();

        this.gameTick++;
        console.log('game tick is ' + this.gameTick);
    
    },

    resize: function(){
        this.background.scale.y=0.25;
        this.background.scale.x=0.25;
    },

    setupEnemies: function() {
        // Setup sprite group for enemies
        enemies = this.add.group();
        enemies.enableBody = true
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
    },

    spawnEnemies: function() {
        // I am not sure when enemy will be released. this might be a memory leak?
        var enemy = enemies.create(this.world.width, this.world.height - 100, 'enemy');
        enemy.scale.setTo(2, 2);
        enemy.body.velocity.x = - ((Math.random() * this.ENEMY_VELOCITY_MAX_VARIANCE) + this.ENEMY_VELOCITY_BASE);
        enemy.health = 3;
        enemy.animations.add('walk');
        enemy.play('walk', 10, true);
        // Need to add hp bar to enemy
    },

    checkCollisions: function() {
        // check if ball hit enemy

        // check if enemy hit player
    },
    

    kick: function(){

    },
};