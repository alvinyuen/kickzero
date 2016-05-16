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

        /* I don't think the box is spinning and I'm not sure how to get it working.. using load bar instead..
        var box = this.make.graphics(0,0);
        box.lineStyle(8,7322079,0.8);
        box.beginFill(7322079,1);
        box.drawRect(0, 0, 90,90);
        box.endFill();
        this.spinner = this.add.sprite(this.world.centerX, this.world.centerY, box.generateTexture());
        this.spinner.anchor.set(0.5);

        this.add.tween(this.spinner.scale).to(
            { x: 0, y: 0 }, 1000, "Elastic.easeIn", true, 250
        );
        */

        this.text = this.add.text(this.game.world.centerX, this.game.world.centerY, "Loading: 0%", style);
        this.text.anchor.setTo(0.5);

        this.load.image('default-background','assets/backgrounds/full-background.png');
        this.load.image('ball', 'assets/sprites/ball.png');
        this.load.spritesheet('megaman','assets/sprites/megaman.png', 160, 160, 3);
        this.load.spritesheet('button', 'assets/images/button.png', 256, 80, 3);
        this.load.spritesheet('enemy', 'assets/sprites/enemy.png', 29.25, 36, 8);
        //simulating page load
        for(var i=0;i<100;i++){
            this.load.image('full-background'+i, 'assets/backgrounds/full-background.png?rnd='+i);
        }

        this.load.onFileComplete.add(this.fileLoaded, this);

        // Not sure if this is working as well.
        this.add.tween(this.text).to(
            { alpha: 0 }, 1000, "Linear", true
        );
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
        // it doesn't seem to be spinning.. :S
        //this.spinner.rotation+=0.05;
    },

};