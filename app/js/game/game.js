angular.module('rl-app').service('game', function($rootScope, Auth, socketFactory) {

  //set up socket
  var socket = socketFactory();
  socket.forward('broadcast');

  var canvWidth = 1280;
  var canvHeight = 800;
  var gs = 4;                 // Set global scale
  var underText;              // Text below logo
  var progText;               // Load indicator text

  var game = new Phaser.Game( // Initialize game
    canvWidth, canvHeight,    // Set canvas bounds
    Phaser.AUTO,              // Select rendering engine
    'game',                   // Div ID to target for canvas insertion
    null,                     // Default state object. States are managed below.
    false,                    // Transparent canvas
    false);                   // Antialias

  var sendMessage = function () {
    socket.emit('message', 'herp', 'derp');
  };

  var bootState = {
    preload: function () {
      game.stage.backgroundColor = '#0b0b0b';
      game.load.image('logo', 'js/game/assets/rl-logo-small.png');
      game.load.spritesheet('progBar', 'js/game/assets/progressBar.png',202,12,2);
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
      underText = game.add.bitmapText(
        game.defPos.x, game.defPos.y - 30 * gs, 'fontW', 'Loading...', 16 * gs);
      underText.anchor.setTo(0.5, 0.5);
      sendMessage();
      game.state.start('load', false);
    },
  };

  var loadState = {
    preload: function() {
      // Progress Bar
      game.progFrame = game.add.sprite(game.defPos.x, game.defPos.y + 60 * gs, 'progBar', 0);
      game.progFrame.scale.x = gs;
      game.progFrame.scale.y = gs;
      game.progFrame.anchor.setTo(0.5, 0.5);
      game.progBar = game.add.sprite(game.progFrame.x, game.progFrame.y, 'progBar', 1);
      game.progBar.scale.x = gs;
      game.progBar.scale.y = gs;
      game.progBar.anchor.setTo(0.5, 0.5);
      game.load.setPreloadSprite(game.progBar);

      progText = game.add.bitmapText(
        game.progFrame.x, game.progFrame.y, 'fontW',
        '100%', 16 * gs);
      progText.anchor.setTo(0.5, 0.5);

      game.load.onFileComplete.add(function(progress) {
        progText.setText = progress+"%";
      }, this);

      //load files
      game.load.image('createNew', 'js/game/assets/createNew.png');
      game.load.bitmapFont('fontOL', 'js/game/assets/fonts/nt_ol.png', 'js/game/assets/fonts/nt_ol.fnt');
      game.load.spritesheet('guy', 'js/game/assets/guy.png', 16, 24);
      game.load.image('colorBtn', 'js/game/assets/chngColorBTN.png');
      game.load.image('enterBtn', 'js/game/assets/enterBTN.png');
    },
    create: function() {
      game.state.start('title', false);
    }
  };

  var titleState = {
    create: function () {
      progText.kill();
      game.progFrame.kill();
      game.progBar.kill();
    },
    update: function () {
      if (!$rootScope.currentUser) {
        underText.setText('Please log in...');

      } else {
        game.state.start('menu', false);
      }
    }
  };

  var menuState = {
    create: function () {
      underText.destroy();

      game.player = game.add.sprite(game.defPos.x, game.defPos.y, 'guy', 0);
      setUpPlayer(game.player);
      setUpButtons();

    }
  };

  var playState = {
    create: function () {
      game.cursor = game.input.keyboard.createCursorKeys();
      game.logo.destroy();
      game.colorBtn.destroy();
      game.enterBtn.destroy();
    },
    update: function () {
      movePlayer();
    }
  };

  this.start = function() {
    game.state.start('boot');
  };

  this.reset = function() {
    game.state.clearCurrentState();
    game.state.start('boot');
  };

  var setUpPlayer = function(player) {
    player.anchor.setTo(0.5, 0.5);
    player.scale.x = gs;
    player.scale.y = gs;
    game.physics.arcade.enable(player);

    //name above player
    var nameText = game.add.bitmapText(
      0, -14, 'fontOL',
      $rootScope.currentUser.username, 8);
    nameText.anchor.setTo(0.5, 1);
    player.addChild(nameText);

    //animations
    player.animations.add('down', [0,1,0,2], 10,  true);
    player.animations.add('left', [5,3,5,4], 10, true);
    player.animations.add('right', [6,7,6,8], 10, true);
    player.animations.add('up', [9,10,9,11], 10, true);
  };

  var setUpButtons = function() {
    game.colorBtn = game.add.sprite(game.defPos.x, game.defPos.y + 40 * gs, 'colorBtn');
    game.colorBtn.anchor.setTo(0.5, 0.5);
    game.colorBtn.scale.x = gs;
    game.colorBtn.scale.y = gs;
    game.colorBtn.inputEnabled = true;
    game.colorBtn.buttonMode = true;
    game.colorBtn.events.onInputDown.add(function(){
      var tint = Math.random() * 0xffffff;
      game.player.tint = tint;
      game.colorBtn.tint = tint;
    });

    game.enterBtn = game.add.sprite(game.defPos.x, game.defPos.y + 68 * gs, 'enterBtn');
    game.enterBtn.anchor.setTo(0.5, 0.5);
    game.enterBtn.scale.x = gs;
    game.enterBtn.scale.y = gs;
    game.enterBtn.inputEnabled = true;
    game.enterBtn.buttonMode = true;
    game.enterBtn.events.onInputDown.add(function(){
      game.state.start('play', false);
    });

  };

  var movePlayer = function() {

    var speed = 200;
    game.player.facingDir = 3;
    game.player.body.velocity.x = 0;
    game.player.body.velocity.y = 0;

    if (game.cursor.up.isDown) {
      game.player.body.velocity.y = -speed;
      game.player.facingDir = 1;
    } else if (game.cursor.down.isDown) {
      game.player.body.velocity.y = speed;
      game.player.facingDir = 3;
    }
    if (game.cursor.left.isDown) {
      game.player.body.velocity.x = -speed;
      game.player.facingDir = 4;
    } else if (game.cursor.right.isDown) {
      game.player.body.velocity.x = speed;
      game.player.facingDir = 2;
    }
    switch (game.player.facingDir) {
      case 1: game.player.animations.play('up'); break;
      case 2: game.player.animations.play('right'); break;
      case 3: game.player.animations.play('down'); break;
      case 4: game.player.animations.play('left'); break;
    }
    if (!game.player.body.velocity.x && !game.player.body.velocity.y) {
      game.player.animations.stop(); // Stop the animation
      game.player.frame = 0; // Set the player frame to 0 (stand still)
    }
  }

  game.state.add('boot', bootState);
  game.state.add('load', loadState);
  game.state.add('title', titleState);
  game.state.add('menu', menuState);
  game.state.add('play', playState);
});




