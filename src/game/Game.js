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
        this.BOSS_SCALE = 1;

        //game settings
        this.GRAVITY = 500;  //pixels/second/second
        this.NUMBER_OF_ENEMIES = 3;
        this.BOSS_SPAWN_KILL = 5; // number of enemies killed before boss spawns
        this.BOSS_MAXHEALTH = 15;
        this.BALL_DAMAGE = 3;


    },

    create: function(){
        this.setupGround();
        this.setupBackground();
        this.setupPlayer();
        this.setupBall();
        this.setupCrossHair();
        this.setupBosses();
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
        this.scoreBuffer = 0;
        this.setupScoreboard();

        //set initial enemy kill counter && boss kill counter
        this.enemyCounter = 0;
        this.bossDead = true;
    },



    update: function(){
        //background tile movement
        this.background.tilePosition.x -=20;
        //ball spin animation
        // animation was weird when ball velocity reached 0 so making it spin constantly
        // this.ball.angle += (this.ball.body.velocity.x / 5);
        this.ball.angle +=30;

        // spawn enemies
        // i assume 60fps, spawn enemy every 3 seconds <-- changed so spawns randomly every 1,2 or 3 seconds
        // changed boss spawn according to enemy spawns - boss spawns only after certain number of enemies spawn else keep spawning enemies
        if ((this.gameTick % (1/(Math.floor((Math.random()*3)+1))*180) == 0)) {

            //use bossDead state to control whether to continue enemy spawns
            if(this.bosses.countDead()===1 &&  (this.enemyCounter % this.BOSS_SPAWN_KILL !=0 || this.enemyCounter===0 || this.bossDead)) {
                this.bossDead = false;
                console.log('spawning enemy');
                this.spawnEnemies();
            }
            else if(this.bosses.countDead()===1 && this.enemies.countDead()===this.NUMBER_OF_ENEMIES){
                   this.spawnBoss();
                   //bossDead state change to true when boss dies
                }
        }

        //mimic boss forward and backward movement
        if(this.bosses.getFirstAlive()!=null|| this.bosses.getFirstAlive()!=undefined) {
            var boss = this.bosses.getFirstAlive();
            if (boss.position.x < (this.world.width * (2 / 3))) {
                boss.body.velocity.x = ((Math.random() * this.ENEMY_VELOCITY_MAX_VARIANCE) + this.ENEMY_VELOCITY_BASE);
            }
            else if (boss.position.x > this.world.width - 50) {
                boss.body.velocity.x = -((Math.random() * this.ENEMY_VELOCITY_MAX_VARIANCE) + this.ENEMY_VELOCITY_BASE);
            }
        }



         //while there is score in scoreBuffer, update score
        if(this.scoreBuffer>0){
            this.incrementScore();
            this.scoreBuffer--;
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

    setupBosses: function(){
        //setup boss
        this.bosses = this.add.group();
        var boss = this.game.add.sprite(this.world.width, 0, 'boss');
        boss.anchor.setTo(0.5, 0.5);
        this.bosses.add(boss);
        this.physics.arcade.enable(this.bosses);
        this.bosses.enableBody = true;
        this.bosses.physicsBodyType = Phaser.Physics.ARCADE;
        //set initial state to dead
        boss.kill();

        // This event listener must be added after boss is initially killed
        boss.events.onKilled.add(this.bossKilled, this);
    },



    setupExplosion: function(){
        this.explosions = this.add.group();
    },



    setupScoreboard: function(){
        this.scoreText = this.add.text(this.game.world.centerX,50, 'Score: 0',{font:'bold 18px Arial', fill:'#123456'});
        this.scoreText.anchor.setTo(0.5,0.5);
        this.scoreTextTween = this.add.tween(this.scoreText.scale).to({x:1.5, y:1.5}, 200, Phaser.Easing.Linear.In).to({x:1,y:1}, 200, Phaser.Easing.Linear.In);
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
        enemy.health = 9;
        enemy.animations.add('walk');
        enemy.play('walk', 10, true);
        // Need to add hp bar to enemy

        //add spawn counter
        this.enemyCounter++;
    },

    spawnBoss: function(){

        //retrieve boss from pool
        var boss = this.bosses.getFirstDead();

        if(boss===null || boss===undefined) return;

        //revive boss
        boss.revive();

        boss.scale.setTo(this.BOSS_SCALE, this.BOSS_SCALE);
        boss.position.x = this.world.width;
        var bossYOffset = this.world.height - boss.height/2.0 - this.FLOOR_HEIGHT;
        boss.position.y = bossYOffset;
        boss.body.velocity.x = - ((Math.random() * this.ENEMY_VELOCITY_MAX_VARIANCE) + this.ENEMY_VELOCITY_BASE);       
        boss.health = this.BOSS_MAXHEALTH;
        boss.maxHealth = this.BOSS_MAXHEALTH;
        boss.animations.add('walk');
        boss.play('walk',10, true);

        //setup boss healthbar
        //##barConfig - customization
         var barConfig = {
            x: 0,
            y: -75,
            width: 150,
            height: 10,
            bg: {
                color: '#000000'
            },
           bar: {
                color: '#39d179'
                }
            };

        if (boss.healthBar===null || boss.healthBar === undefined) {
            boss.healthBar = new HealthBar(this.game, boss, barConfig);
        }
        boss.healthBar.setPercent(100);
    },


    checkCollisions: function() {
        // sprites and ground collision
        this.physics.arcade.collide(this.player, this.ground);
        this.physics.arcade.collide(this.ball, this.ground);
        this.physics.arcade.collide(this.bosses, this.ground);
        this.physics.arcade.collide(this.enemies, this.ground);

        // check if ball hit enemy
        this.physics.arcade.overlap(this.ball, this.enemies, this.ballHitEnemy, null, this);

        //check if ball hit boss
        this.physics.arcade.overlap(this.ball, this.bosses, this.ballHitBoss, null, this);

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
        this.physics.arcade.overlap(this.bosses, this.player, this.enemyHitPlayer, null, this);
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

        //ball bounce physics
        this.bounceBall();

        //play explosion
        this.explode(enemy.position.x, enemy.position.y);
        //kill enemy
        enemy.kill();
        //add score
        this.scoreBuffer+=20;
        //score animation
        this.createScoreAnimation(enemy.position.x, enemy.position.y-100, '+20','');


    },

    ballHitBoss: function(ball, boss){
        console.log('ball hit boss');

        //bounce ball
        this.bounceBall();

        //boss will need three hits before it dies
        boss.damage(this.BALL_DAMAGE);

        //boss death is implemented by listening to onKilled event in setupBoss method
        boss.healthBar.setPercent(boss.health / boss.maxHealth * 100);
    },

    bossKilled: function(boss){
        console.log('boss killed'+ boss);

        //play explosion
        this.explode(boss.position.x, boss.position.y);

        //update score
        this.scoreBuffer+=50;
        this.createScoreAnimation(boss.position.x, boss.position.y-100, '+50','');

        //set boss state to dead to continue enemy spawn
        this.bossDead = true;

    },

    bounceBall: function(){
        //ball physics
        this.ball.body.drag.setTo(0,0);
        //Math.atan2(velocity y, velocity x) to calculate angle
        this.ball.rotation = Math.atan2(-100, -100);
        //make this vary to increase game difficulty
        this.ball.body.velocity.x = Math.cos(this.ball.rotation) * ((Math.random()*2)+1)* this.BALL_REPEL_VELOCITY;
        this.ball.body.velocity.y = Math.sin(this.ball.rotation) * this.BALL_REPEL_VELOCITY;

    },



    kick: function() {
        console.log('kick ball');
        this.ball.body.velocity.x = 1200;
        //check kick accuracy
        this.checkAccuracy();
        //add drag to ball if no enemies
        if(this.enemies.countDead()===this.NUMBER_OF_ENEMIES && this.bosses.countDead() ===1){
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
        if(ballCrosshairDistance <= this.crosshair.width*0.20){
            console.log('perfect kick');
            //update score buffer
            this.scoreBuffer+=10;
            //play score animation
            this.createScoreAnimation(this.player.position.x + this.player.width/2.0, this.player.position.y -30, 'Perfect!', '+10');
        }
        //good hit
        else if(ballCrosshairDistance > this.crosshair.width * 0.20 && ballCrosshairDistance < this.crosshair.width * 0.75){
            console.log('good kick');
            this.score+=5;
            this.createScoreAnimation(this.player.position.x + this.player.width/2.0, this.player.position.y -30, 'Good!', '+5');
        }
        //miss
        else if (this.player.alive) {
            //If miss, don't immediately jump to menu, show game over animation
            this.explode(this.player.position.x + this.player.width /2.0, this.player.position.y + this.player.height / 2.0)
            //kill player and ball
            this.player.kill();
            this.ball.kill();
            this.createScoreAnimation(this.player.position.x + this.player.width/2.0, this.player.position.y - 30, 'Miss!','');
        }

        // currently in game over state, tap to restart
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
    },



    //increment score through update function
    incrementScore: function(){
        this.score+=1;
        this.scoreText.text = 'Score : '+ this.score;
    },


    //create score animation
    createScoreAnimation: function(x, y, message, score){
        var scoreFont = '30px Arial';
        //create a new label animation for the score
        var scoreAnimation = this.add.text(x,y, message+ ' '+score, {font: scoreFont, fill:"#39d179", stroke: "ffffff", strokeThickness: 15});
        scoreAnimation.anchor.setTo(0.5,0);
        scoreAnimation.align = 'center';

        //tween score animation label to total score label
        var scoreTween = this.add.tween(scoreAnimation).to({x:this.world.centerX, y:50}, 800, Phaser.Easing.Exponential.In, true);
        scoreTween.onComplete.add(function(){
            scoreAnimation.destroy();
            this.scoreTextTween.start();
        }, this);
    }

};
