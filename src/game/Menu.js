/**
 * Created by alvin on 2016/5/6.
 */
KickZero.Menu = function(game){

};
KickZero.Menu.prototype = {
    preload: function(){
        this.background = this.game.add.tileSprite(0,0, 3712,1536, 'default-background');
        this.resize();
    },
    create: function(){
        this.megaman = this.add.sprite(300, 200, 'megaman');
        this.megaman.animations.add('walk');
        this.megaman.play('walk',10, true);
    },

    update: function(){
        this.background.tilePosition.x -=5;
    },

    resize: function(){
        this.background.scale.y=0.25;
        this.background.scale.x=0.25;
    }
};