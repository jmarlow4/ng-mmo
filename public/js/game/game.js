var mainState = {

  preload: function() { //Executed first and loads game assets
    this.load.image('logo', 'js/game/img/rl-logo-small.png');
    this.startingPos = new Phaser.Point(
      Math.floor(canvWidth / 2), Math.floor(canvHeight / 2));
  },

  create: function() { //Sets up game and displays assets
    this.logo = game.add.sprite(
      this.startingPos.x, this.startingPos.y - 60 * globalScale, 'logo');
    this.logo.scale.x = globalScale;
    this.logo.scale.y = globalScale;
    this.logo.anchor.setTo(0.5, 0.5);
  },

  update: function() { //Called 60 fps and contains game logic

  },
};

//Configure display
var canvWidth = 1280;
var canvHeight = 800;

// Initialize Phaser
var game = new Phaser.Game(
  canvWidth, canvHeight, Phaser.AUTO, 'game-canvas', null, false, false);

var globalScale = 4;

//var scalar = 240;
//if (canvHeight / scalar >= 2 && canvHeight / scalar < 3) {
//    globalScale = .5;
//}
//else if (canvHeight / scalar >= 3 && canvHeight / scalar < 4) {
//    globalScale = .75;
//}
//else if (canvHeight / scalar >= 4) {
//    globalScale = 1;
//}

// Add and start "main" state
game.state.add('main', mainState);
game.state.start('main');