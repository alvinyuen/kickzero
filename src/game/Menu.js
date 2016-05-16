/**
 * Created by alvin on 2016/5/6.
 */

KickZero.Menu = function(game){
    this.FLOOR_HEIGHT = 50;
    this.BALL_INITIAL_XOFFSET = 400;
    this.PLAYER_XOFFSET = 50;
};

KickZero.Menu.prototype = {

    create: function(){

        this.background = this.game.add.tileSprite(0,0, 3712,1536, 'default-background');
        this.resize();

        this.megaman = this.add.sprite(this.PLAYER_XOFFSET, 0, 'megaman');
        var megamanYOffset = this.world.height - this.megaman.height - this.FLOOR_HEIGHT;
        this.megaman.position.y = megamanYOffset;
        this.megaman.animations.add('walk');
        this.megaman.play('walk', 10, true);

        this.ball = this.add.sprite(this.BALL_INITIAL_XOFFSET, 0, 'ball');
        var ballYOffset = this.world.height - (0.5 * this.ball.height) - this.FLOOR_HEIGHT;
        this.ball.position.y = ballYOffset;
        this.ball.anchor.setTo(0.5 , 0.5);

        var titleStyle = {font: "bold 32px Arial", fill:"#123456"/*, boundsAlignH: "center", boundsAlignV:"middle"*/};
        var title = this.add.text(this.game.world.centerX, this.game.world.centerY - 50, "KickZero", titleStyle);
        title.anchor.setTo(0.5, 0.5);
        title.padding.set(10, 16);
        title.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);

        var startButtonTextStyle = { font: "30px Arial", fill: "#fff", align: "center" }
        startButton = this.add.button(this.game.world.width - 300, 0, 'button', this.startGame, this, 0, 0, 1, 0);
        var startButtonYOffset = this.world.height - startButton.height - this.FLOOR_HEIGHT;
        startButton.position.y = startButtonYOffset

        var startButtonText = this.add.text(0, 0, "Click to Start", startButtonTextStyle);
        startButtonText.anchor.set(0.5);
        startButtonText.position.setTo(startButton.width/2, startButton.height/2)
        startButton.addChild(startButtonText);
    },

    update: function(){
        this.background.tilePosition.x -=5;
        this.ball.angle +=10;
    },

    resize: function(){
        this.background.scale.y=0.25;
        this.background.scale.x=0.25;
    },

    startGame: function() {
        this.state.start('Game');
    }
};