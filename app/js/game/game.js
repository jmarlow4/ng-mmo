angular.module('rl-app').service('game', function($rootScope, SocketIO) {

  //game code
  var canvWidth = 1280;
  var canvHeight = 800;
  //set global scale
  var gs = 4;
  var text = '!';

  var sendMessage = function () {
    SocketIO.emit('message', 'derp', 'hit that purp skurp');
  }

  var menuState = {
    preload: function() { //Executed first and loads game assets
      this.stage.backgroundColor = '#0b0b0b';
      this.load.image('logo', 'js/game/assets/rl-logo-small.png');
      this.load.bitmapFont('fontOL', 'js/game/assets/fonts/nt_ol.png', 'js/game/assets/fonts/nt_ol.fnt');
      this.load.bitmapFont('fontW', 'js/game/assets/fonts/nt_white.png', 'js/game/assets/fonts/nt_white.fnt');
      this.startingPos = new Phaser.Point(
        Math.floor(canvWidth / 2), Math.floor(canvHeight / 2));
    },
    create: function() { //Sets up game and displays assets

      //logo
      this.logo = game.add.sprite(
        this.startingPos.x, this.startingPos.y - 60 * gs, 'logo');
      this.logo.scale.x = gs;
      this.logo.scale.y = gs;
      this.logo.anchor.setTo(0.5, 0.5);

      //text
      this.text = game.add.bitmapText(
        this.startingPos.x, this.startingPos.y - 30 * gs, 'fontW', text, 16 * gs);
      this.text.anchor.setTo(0.5, 0.5);
      sendMessage();
    },
    update: function() { //Called 60 fps and contains game logic

      if ($rootScope.currentUser) {
        this.text.setText('Welcome, ' + $rootScope.currentUser.username + '!');
      } else {
        this.text.setText('Please log in...');
      }
    }
  };

  var playState = {
    preload: function () {},
    create: function () {},
    update: function () {}
  };

  var game = new Phaser.Game(
    canvWidth, canvHeight, Phaser.AUTO, 'game', null, false, false);

  game.state.add('menu', menuState);
  game.state.add('play', playState);

  this.start = function() {
    game.state.start('menu');
  };


});




