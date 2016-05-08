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

        this.background = this.game.add.tileSprite(0,0, 3712,1536, 'default-background');
        this.resize();
        var box = this.make.graphics(0,0);
        box.lineStyle(8,7322079,0.8);
        box.beginFill(7322079,1);
        box.drawRect(0, 0, 90,90);
        box.endFill();
        this.spinner = this.add.sprite(this.world.centerX, this.world.centerY, box.generateTexture());
        this.spinner.anchor.set(0.5);
        //this.load.setPreloadSprite(this.spinner);
        this.text = this.add.text(340,185, "Loading: 0%", style);
        this.load.image('default-background','assets/backgrounds/full-background.png');
        this.load.image('ball', 'assets/sprites/ball.png');
        this.load.spritesheet('megaman','assets/sprites/megaman.png', 160, 160, 3);
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
};