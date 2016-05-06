/**
 * Created by alvin on 2016/5/6.
 */
KickZero.Menu = function(game){

};
KickZero.Menu.prototype = {

    init: function(){
    },
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
        this.megaman = this.add.sprite(100, 200, 'megaman');
        this.megaman.animations.add('walk');
        this.megaman.play('walk',15, true);
        this.ball = this.add.sprite(260, 330, 'ball');
        this.ball.anchor.setTo(0.5,0.5);

        this.add.tween(this.spinner.scale).to(
            { x: 0, y: 0 }, 1000, "Elastic.easeIn", true, 250
        );
        this.add.tween(this.text).to(
            { alpha: 0 }, 1000, "Linear", true
        );
    },

    update: function(){
        this.background.tilePosition.x -=5;
        this.ball.angle +=10;
        this.spinner.rotation+=0.05;
    },

    resize: function(){
        this.background.scale.y=0.25;
        this.background.scale.x=0.25;
    }
};