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

    	// loading screen will have a black background
    	this.game.stage.backgroundColor = '#000000';

    	// scaling options
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    	// have the game centered
    	this.scale.pageAlignHorizontally = true;
    	this.scale.pageALignVertically = true;

    	this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    },

};