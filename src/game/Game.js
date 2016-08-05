KickZero.Game = function(game){
};

KickZero.Game.prototype = {
    
    init: function() {
        //offsets
        this.PLAYER_XOFFSET = 50;
        this.BALL_INITIAL_XOFFSET = 400;
        this.CROSSHAIR_XOFFSET = 150;
        
        //velocity
        this.ENEMY_VELOCITY_MAX_VARIANCE = 50;
        this.ENEMY_VELOCITY_BASE = 100;
        this.BALL_INIT_VELOCITY = 200;
        this.BALL_RETURN_VELOCITY = 150;
        this.BALL_REPEL_VELOCITY = 400;
       
        //dimension
        this.FLOOR_HEIGHT = 52;

        //scale
        this.BACKGROUND_SCALE = 0.25;
        this.PLAYER_SCALE = 0.5;
        this.BALL_SCALE = 0.5;
        this.CROSSHAIR_SCALE = 2;
        this.ENEMY_SCALE = 1;
        
        //game settings
        this.GRAVITY = 500;  //pixels/second/second
        this.NUMBER_OF_ENEMIES = 3;
    },

    create: function(){
        this.setupGround();
        this.setupBackground();
        this.setupPlayer();
        this.setupBall();
        this.setupCrossHair();
        this.setupEnemies();
        this.setupExplosion();
        //add mouseclick
        this.input.onDown.add(this.kick, this);
        //add keyboard
        this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spacebar.onDown.add(this.kick, this);
        //game init timer
        this.gameTick = 0;
       //turn on game gravity
        this.physics.arcade.gravity.y = this.GRAVITY;
        //set scoreboard
        this.score = 0;
        this.scoreText = this.add.text(this.game.world.centerX,50, 'Score: 0',{font:'bold 18px Arial', fill:'#123456'});
        this.scoreText.anchor.setTo(0.5,0.5);
    },

    
    
    update: function(){
        //background tile movement
        this.background.tilePosition.x -=50;
        //ball spin animation
        // animation was weird when ball velocity reached 0 so making it spin constantly
        // this.ball.angle += (this.ball.body.velocity.x / 5);
        this.ball.angle +=30;
        // spawn enemies
        // i assume 60fps, spawn enemy every 3 seconds <-- changed so spawns randomly every 1,2 or 3 seconds
        if (this.gameTick % (1/(Math.floor((Math.random()*3)+1))*180) == 0) {
            console.log('spawning enemy');
            this.spawnEnemies();
        }
        //collision check
        this.checkCollisions();
        // return ball to player when ball stops
        if(this.ball.body.velocity.x ===0){
            //remove drag
            this.ball.body.drag.setTo(0,0);
            this.ball.body.velocity.x = -this.BALL_RETURN_VELOCITY;
        }
        //update crosshair position according to ball
        this.crosshair.position.y = this.ball.position.y;
        //game timer
        this.gameTick++;
        //console.log('game tick is ' + this.gameTick);
    },
    
    
    
    setupBackground: function(){
        this.background = this.game.add.tileSprite(0,0, 3712,1536, 'default-background');
        this.background.scale.setTo(this.BACKGROUND_SCALE, this.BACKGROUND_SCALE);
    },
    
    
    
    setupGround: function(){
        //create ground to enable bounce effect for ball
        this.ground = this.add.group();
        for(var x = 0; x < this.world.width; x+=96){
            var groundBlock = this.add.sprite(x, this.world.height - 52, 'ground' );
            groundBlock.scale.y = 0.25;
            groundBlock.scale.x = 0.25;
            this.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }
    },

    
    
    setupPlayer: function() {
        this.player = this.add.sprite(this.PLAYER_XOFFSET, 0, 'megaman');
        this.player.scale.setTo(this.PLAYER_SCALE, this.PLAYER_SCALE);
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
        this.ball.scale.setTo(this.BALL_SCALE, this.BALL_SCALE);
        // Offset is halved because anchor is set to center instead of top left corner
        var ballYOffset = this.world.height - this.ball.height/2.0 - this.FLOOR_HEIGHT;
        this.ball.position.y = ballYOffset;
        this.ball.anchor.setTo(0.5 , 0.5);
        this.physics.arcade.enable(this.ball);
        this.ball.enableBody = true;
        this.ball.physicsBodyType = Phaser.Physics.ARCADE;
        this.ball.body.velocity.x = -this.BALL_INIT_VELOCITY;
        this.ball.body.bounce.set(0.5);
    },

    
    
    setupCrossHair: function() {
        this.crosshair = this.add.sprite(this.CROSSHAIR_XOFFSET, 0, 'crosshair');
        this.crosshair.scale.setTo(this.CROSSHAIR_SCALE, this.CROSSHAIR_SCALE);
        var crosshairYOffset = this.ball.position.y;
        this.crosshair.position.y = crosshairYOffset;
        this.crosshair.anchor.setTo(0.5, 0.5);
        // this.physics.arcade.enable(this.crosshair);
        this.crosshair.enableBody = true;
        this.crosshair.physicsBodyType = Phaser.Physics.ARCADE;
    },

    
    
    setupEnemies: function() {
        // Setup sprite group for enemies
        this.enemies = this.add.group();
        for (var i = 0; i < this.NUMBER_OF_ENEMIES; i++) {
            var enemy = this.game.add.sprite(this.world.width, 0, 'enemy');
            enemy.anchor.setTo(0.5,0.5);
            this.enemies.add(enemy);
            this.physics.arcade.enable(this.enemies);
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
            //set initial state to dead
            enemy.kill();
        }
    },

    
    
    setupExplosion: function(){
        this.explosions = this.add.group();
    },

    
    
    spawnEnemies: function() {
        // I am not sure when enemy will be released. this might be a memory leak?
        // don't think you can track enemies alive with this. seems like this will keep adding new enemy objects into the pool
        // var enemy = this.enemies.create(this.world.width, 0, 'enemy');

        //retrieve enemy from pool
        var enemy = this.enemies.getFirstDead();
        //using this to control the number of enemies alive, if enemies still alive, nothing happens
        if(enemy===null || enemy===undefined) return;
        // revive enemy
        enemy.revive();
        
        enemy.scale.setTo(this.ENEMY_SCALE, this.ENEMY_SCALE);
        enemy.position.x = this.world.width;
        var enemyYOffset = this.world.height - enemy.height/2.0 - this.FLOOR_HEIGHT;
        enemy.position.y = enemyYOffset;
        enemy.body.velocity.x = - ((Math.random() * this.ENEMY_VELOCITY_MAX_VARIANCE) + this.ENEMY_VELOCITY_BASE);
        enemy.health = 3;
        enemy.animations.add('walk');
        enemy.play('walk', 10, true);
        // Need to add hp bar to enemy
    },

    
    
    checkCollisions: function() {
        // sprites and ground collision
        this.physics.arcade.collide(this.player, this.ground);
        this.physics.arcade.collide(this.ball, this.ground);
        this.physics.arcade.collide(this.enemies, this.ground);
        
        // check if ball hit enemy
        this.physics.arcade.overlap(this.ball, this.enemies, this.ballHitEnemy, null, this);
        
        // check if ball hit player
        // not working since sprite dimensions not correct
        this.physics.arcade.overlap(this.ball, this.player, this.ballHitPlayer, null, this);

        //use this instead to determine if ball hits or passes player
        if((this.ball.position.x -50) < this.player.position.x && this.player.alive){
            //player explode :D
            this.explode(this.player.position.x + this.player.width/2.0, this.player.position.y + this.player.height/2.0)
            //kill player and ball
            this.player.kill();
            this.ball.kill();
            //change to gameover state
        }
        // check if enemy hit player <-- should never happen?
        this.physics.arcade.overlap(this.enemies, this.player, this.enemyHitPlayer, null, this);
    },

    
    
    ballHitPlayer: function(ball, player) {
        console.log('ball hit player');
    },

    
    
    enemyHitPlayer: function(enemy, player) {
        console.log('enemy hit player');
        this.state.remove('');
        this.state.start('Menu');
    },
    
    
    
    ballHitEnemy: function(ball, enemy) {
        console.log('ball hit enemy');
        //ball physics
        this.ball.body.drag.setTo(0,0);
        //Math.atan2(velocity y, velocity x) to calculate angle
        this.ball.rotation = Math.atan2(-100, -100);
        //make this vary to increase game difficulty
        this.ball.body.velocity.x = Math.cos(this.ball.rotation) * ((Math.random()*2)+1)* this.BALL_REPEL_VELOCITY;
        this.ball.body.velocity.y = Math.sin(this.ball.rotation) * this.BALL_REPEL_VELOCITY;
        //play explosion
        this.explode(enemy.position.x, enemy.position.y);
        //kill enemy
        enemy.kill();
        //add score
        this.score+=20;
        //update score
        this.updateScore();
    },

    

    kick: function() {
        console.log('kick ball');
        this.ball.body.velocity.x = 1200;
        //check kick accuracy
        this.checkAccuracy();
        //add drag to ball if no enemies
        if(this.enemies.countDead()===this.NUMBER_OF_ENEMIES){
            this.ball.body.drag.setTo(300,0);
            //lower ball velocity
            this.ball.body.velocity.x = 300;
        }
        else{
            //adding more y velocity because ball sometimes end up in the air not hitting enemy and goes out of bounds
            this.ball.body.velocity.y = 200;
        }
    },
    
    
    
    checkAccuracy: function(){
        var ballCrosshairDistance = Math.abs(this.ball.position.x - this.crosshair.position.x);
        //perfect hit
        if(ballCrosshairDistance <= this.crosshair.width*0.25){
            console.log('perfect kick');
            this.score+=10;
            this.updateScore();
        }
        //good hit
        else if(ballCrosshairDistance > this.crosshair.width * 0.25 && ballCrosshairDistance < this.crosshair.width * 0.75){
            console.log('good kick');
            this.score+=5;
            this.updateScore();
        }
        //miss
        else{
            console.log('missed!');
            //add game over state
            this.state.start('Menu');
        }
    },
    
    
    
    updateScore: function(){
        this.scoreText.text = 'Score: '+this.score;
    },

    
    
    explode: function(positionX, positionY) {
        var explosion = this.explosions.getFirstDead();
        // create new explosion if none in pool
        if (explosion === null) {
            explosion = this.game.add.sprite(0, 0, 'explosion');
            explosion.anchor.setTo(0.5, 0.5);
            var boomAnimation = explosion.animations.add('boom');
            boomAnimation.killOnComplete = true;
            this.explosions.add(explosion);
        }
            explosion.revive();
            explosion.x = positionX;
            explosion.y = positionY;
            explosion.animations.play('boom', 60, false);
    }

    

};