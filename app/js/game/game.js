angular.module('rl-app').service('game', function($rootScope, socketFactory) {

  //set up socket
  var socket = socketFactory();
  socket.forward('broadcast');

  var canvWidth = 1280;
  var canvHeight = 800;
  var gs = 4;                 // Set global scale

  var game = new Phaser.Game( // Initialize game
    canvWidth, canvHeight,    // Set canvas bounds
    Phaser.AUTO,              // Select rendering engine
    'game',                   // Div ID to target for canvas insertion
    null,                     // Default state object. States are managed below.
    false,                    // Transparent canvas
    false);                   // Antialias

  var sendMessage = function () {
    socket.emit('message', 'derp', 'hit that purp skurp');
  };


  Phaser.Loader.prototype.originalNextFile = Phaser.Loader.prototype.nextFile;

  Phaser.Loader.prototype.nextFile = function(previousIndex, success) {
    var self = this;
    window.setTimeout(function() {
      Phaser.Loader.prototype.originalNextFile.call(self, previousIndex, success);
    }, 1000 /* milliseconds */);
  };

  var bootState = {
    preload: function () {
      game.stage.backgroundColor = '#0b0b0b';
      game.load.image('logo', 'js/game/assets/rl-logo-small.png');
      game.load.spritesheet('progBar', 'js/game/assets/progressBar.png',202,12,2);
      game.load.bitmapFont('fontOL', 'js/game/assets/fonts/nt_ol.png', 'js/game/assets/fonts/nt_ol.fnt');
      game.load.bitmapFont('fontW', 'js/game/assets/fonts/nt_white.png', 'js/game/assets/fonts/nt_white.fnt');

      //Set default point
      game.defPos = new Phaser.Point(
        Math.floor(canvWidth / 2), Math.floor(canvHeight / 2));
    },
    create: function () {
      //set physics
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //logo
      game.logo = game.add.sprite(game.defPos.x, game.defPos.y - 60 * gs, 'logo');
      game.logo.scale.x = gs;
      game.logo.scale.y = gs;
      game.logo.anchor.setTo(0.5, 0.5);

      //text
      game.text = game.add.bitmapText(
        game.defPos.x, game.defPos.y - 30 * gs, 'fontW', 'Loading...', 16 * gs);
      game.text.anchor.setTo(0.5, 0.5);
      game.state.start('load', false);

      // Progress Bar
      game.progFrame = game.add.sprite(game.defPos.x, game.defPos.y + 60 * gs, 'progBar', 0);
      game.progFrame.scale.x = gs;
      game.progFrame.scale.y = gs;
      game.progFrame.anchor.setTo(0.5, 0.5);
      game.state.start('load', false);
      sendMessage();
    },
  };

  var loadState = {
    preload: function() {
      game.progBar = game.add.sprite(game.progFrame.x, game.progFrame.y, 'progBar', 1);
      game.progBar.scale.x = gs;
      game.progBar.scale.y = gs;
      game.progBar.anchor.setTo(0,  0.5);
      game.load.setPreloadSprite(game.progBar);

      game.load.image('createNew', 'js/game/assets/createNew.png');
      game.load.image('table', 'js/game/assets/periodicTable.png');
    },
    create: function() {
      game.state.start('title', false);
    }
  };

  var titleState = {
    create: function () {
      game.progFrame.kill();
      game.progBar.kill();
      //game.table = game.add.sprite(0, 200, 'table');
      //game.table.scale.x = 0.25;
      //game.table.scale.y = 0.25;
    },
    update: function () {
      if (!$rootScope.currentUser) {
        game.text.setText('Please log in...');

      } else {
        game.state.start('menu', false);
      }
    }
  };

  var menuState = {
    create: function () {
      game.text.setText('Welcome, ' + $rootScope.currentUser.username + '!');

      var card;
      this.charCards = game.add.group();
      for (var i = 0; i < $rootScope.currentUser.characters.length; i++) {
        card = game.add.sprite(
          (30 + (i * 90)) * gs,
          85 * gs,
          'createNew', 0, this.charCards);
        card.scale.x = gs;
        card.scale.y = gs;
      }
    }
  };

  var playState = {
    create: function () {},
    update: function () {}
  };


  game.state.add('boot', bootState);
  game.state.add('load', loadState);
  game.state.add('title', titleState);
  game.state.add('menu', menuState);
  game.state.add('play', playState);

  this.start = function() {
    game.state.start('boot');
  };

  this.reset = function() {
    game.state.clearCurrentState();
    game.state.start('boot');
  };
});




