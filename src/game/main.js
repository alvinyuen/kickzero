var state = {
    init: function() {
        var text = "Phaser Version "+Phaser.VERSION + " works!";
        var style = { font: "24px Arial", fill: "#fff", align: "center" };
        var t = game.add.text(250, 240, text, style);


    },
    preload: function() {

    },
    create: function(){

    },
    update: function() {

    }
};

var game = new Phaser.Game(
    800,
    480,
    Phaser.AUTO,
    'game',
    state
);