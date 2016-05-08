/**
 * Created by alvin on 2016/5/6.
 */

// Not sure if this line is needed. Creates new KickZero variable if it doesn't already exist...
KickZero = {};

KickZero.Boot = function(game){};

KickZero.Boot.prototype = {

    preload: function(){
        // Only load assets for preload screen
        this.game.load.image('preloadbar', 'assets/images/preloader-bar.png');
    },
    create: function(){


        this.state.start('Preload');
    },
    update: function(){

    }

};