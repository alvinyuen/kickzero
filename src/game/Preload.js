/**
 * Created by heyward on 2016/5/8.
 */

KickZero.Preload = function(game){};

KickZero.Preload.prototype = {

    preload: function(){
        var style={
            font: "13px Arial",
            fill: "#ffffff",
            align:"center"
        };

        this.preloadBar = this.add.sprite(this.game.world.centerX - 25, this.game.world.centerY + 20, 'preloadbar');
 
        this.load.setPreloadSprite(this.preloadBar);



        this.text = this.add.text(this.game.world.centerX, this.game.world.centerY, "Loading: 0%", style);
        this.text.anchor.setTo(0.5);

        this.load.image('default-background','assets/backgrounds/full-background.png');
        this.load.image('ground', 'assets/backgrounds/ground.png');
        this.load.image('ball', 'assets/sprites/ball.png');
        this.load.image('crosshair', 'assets/images/crosshair.png');
        this.load.spritesheet('megaman','assets/sprites/megaman.png', 160, 160, 3);
        this.load.spritesheet('button', 'assets/images/button.png', 256, 80, 3);
        this.load.spritesheet('enemy', 'assets/sprites/enemy.png', 29.25, 36, 8);
        this.load.spritesheet('explosion','assets/sprites/explosion.png', 64, 64, 25);
        this.load.spritesheet('boss', 'assets/sprites/boss.png', 136.95, 112, 20);
        //simulating page load
        for(var i=0;i<100;i++){
            this.load.image('full-background'+i, 'assets/backgrounds/full-background.png?rnd='+i);
        }

        this.load.onFileComplete.add(this.fileLoaded, this);
        
    },

    fileLoaded: function(progress){
      this.text.text = "Loading: "+progress+"%";
    },
    
    loadUpdate: function(){

    },
    
    create: function(){
        this.state.start('Menu');
    },

    update: function() {
      
    },

};