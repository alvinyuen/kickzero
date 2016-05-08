/**
 * Created by alvin on 2016/5/6.
 */

KickZero.Menu = function(game){

};

KickZero.Menu.prototype = {

    create: function(){
        this.megaman = this.add.sprite(100, 200, 'megaman');
        this.megaman.animations.add('walk');
        this.megaman.play('walk',10, true);
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