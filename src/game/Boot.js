/**
 * Created by alvin on 2016/5/6.
 */
KickZero = {};

KickZero.Boot = function(game){
    //add all game states
    game.state.add('Menu', KickZero.Menu);
};

KickZero.Boot.prototype = {
    init: function(){

    },
    preload: function(){
        this.game.load.image('default-background','assets/backgrounds/full-background.png');
        this.game.load.image('ball', 'assets/sprites/ball.png');
        this.game.load.spritesheet('megaman','assets/sprites/megaman.png', 160, 160, 3);

    },
    create: function(){
        this.state.start('Menu');
    },
    update: function(){

    }

};