angular.module('rl-app').service('game', function($rootScope, socketFactory) {

  //set up socket
  var socket;

  var canvWidth = 1280;
  var canvHeight = 800;
  var gs = 4;                 // Set global scale
  var underText;              // Text below logo
  var progText;               // Load indicator text
  var char = {};
  var remotePlayers = {};

  var game = new Phaser.Game( // Initialize game
    canvWidth, canvHeight,    // Set canvas bounds
    Phaser.AUTO,              // Select rendering engine
    'game',                   // Div ID to target for canvas insertion
    null,                     // Default state object. States are managed below.
    false,                    // Transparent canvas
    false);                   // Antialias

  var bootState = {
    preload: function () {
      // disable game pause when canvas loses focus
      game.stage.disableVisibilityChange = true;

      game.stage.backgroundColor = '#0b0b0b';
      game.load.image('logo', 'js/game/assets/ng-mmo-logo-small.png');
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
      game.state.start('load', false);
    }
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

      game.charCreator = game.add.sprite(game.defPos.x, game.defPos.y, 'guy', 0);
      game.charCreator.nameText = game.add.bitmapText(
        0, -14, 'fontOL', $rootScope.currentUser.username, 16);
      game.charCreator.nameText.anchor.setTo(0.5, 1);
      game.charCreator.addChild(game.charCreator.nameText);
      game.charCreator.anchor.setTo(0.5, 0.5);
      game.charCreator.scale.x = gs;
      game.charCreator.scale.y = gs;

      setUpButtons();
    }
  };

  var playState = {
    create: function () {

      this.lastFrameTime;
      game.logo.destroy();
      game.colorBtn.destroy();
      game.enterBtn.destroy();
      game.charCreator.destroy();

      // connect socket
      socket = socketFactory();
      socket.forward('broadcast');
      socket.on('broadcast', function(str){
        console.log(str);
      });

      // Set up players movement
      game.cursor = game.input.keyboard.createCursorKeys();
      game[char.name] = new Player(game, char);

      getOthers(game);
      transferPlayer(game);

      //console.log(game[char.name]);
      socket.emit('join', char);
      socket.on("playerMoved", this.onMovePlayer.bind(this));
      socket.on('userDisconnected', function(otherChar) {
        game[otherChar.name].destroy();
        //console.log(game[otherChar.name]);
        console.log(game[otherChar.name].name + " disconnected!");
      });

    },
    update: function () {
      game[char.name].movePlayer();

      this.storePreviousPositions();

      if (remotePlayers != {}) {
        for (var remoteChar in remotePlayers) {
          game[remoteChar].interpolate(this.lastFrameTime);
        }
      }

      this.lastFrameTime = game.time.now;

    },

    storePreviousPositions: function() {
      for(var id in remotePlayers) {
        var remotePlayer = remotePlayers[id];
        remotePlayer.previousPosition.set(remotePlayer.position.x, remotePlayer.position.y);
      }
    },

    onMovePlayer: function(data) {
      if(game[char.name] && data.name == game[char.name].name) {
        return;
      }

      var movingPlayer = game[data.name];

      if(movingPlayer.targetPosition) {
        movingPlayer.facing = data.facing;
        movingPlayer.lastMoveTime = game.time.now;

        if(data.x == movingPlayer.targetPosition.x && data.y == movingPlayer.targetPosition.y) {
          return;
        }

        movingPlayer.position.x = movingPlayer.targetPosition.x;
        movingPlayer.position.y = movingPlayer.targetPosition.y;

        movingPlayer.distanceToCover = {x: data.x - movingPlayer.targetPosition.x, y: data.y - movingPlayer.targetPosition.y};
        movingPlayer.distanceCovered = {x: 0, y:0};
      }

      movingPlayer.targetPosition = {x: data.x, y: data.y};
    }
  };

  // Set up player class
  var Player = function (game, charObj) {
    Phaser.Sprite.call(this, game, charObj.x, charObj.y, 'guy', 0);
    game.physics.arcade.enable(this);
    this.name = charObj.name;
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(gs, gs);
    this.nameText = game.add.bitmapText(
      0, -14, 'fontOL', this.name, 16);
    this.nameText.anchor.setTo(0.5, 1);
    this.tint = charObj.color;
    this.nameText.tint = charObj.nameCol;
    this.addChild(this.nameText);
    this.animations.add('down', [0,1,0,2], 10,  true);
    this.animations.add('left', [5,3,5,4], 10, true);
    this.animations.add('right', [6,7,6,8], 10, true);
    this.animations.add('up', [9,10,9,11], 10, true);
    game.add.existing(this);
  };
  Player.prototype = Object(Phaser.Sprite.prototype);
  Player.prototype.movePlayer = function() {
    var speed = 200;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (game.cursor.up.isDown) {
      this.body.velocity.y = -speed;
      this.facing = 1;
    } else if (this.game.cursor.down.isDown) {
      this.body.velocity.y = speed;
      this.facing = 3;
    }
    if (game.cursor.left.isDown) {
      this.body.velocity.x = -speed;
      this.facing = 4;
    } else if (game.cursor.right.isDown) {
      this.body.velocity.x = speed;
      this.facing = 2;
    }
    switch (this.facing) {
      case 1: this.animations.play('up'); break;
      case 2: this.animations.play('right'); break;
      case 3: this.animations.play('down'); break;
      case 4: this.animations.play('left'); break;
      default: this.animations.play('down');
    }


    if (!this.body.velocity.x && !this.body.velocity.y) {
      this.animations.stop(); // Stop the animation
      // Set the player frame to stand still
      switch (this.facing) {
        case 1: this.frame = 9; break;
        case 2: this.frame = 6; break;
        case 3: this.frame = 0; break;
        case 4: this.frame = 5; break;
        default: this.frame = 0;
      }
    } else {
      // if player is moving, send movement data
      socket.emit("movePlayer", {
        name: this.name,
        x: this.position.x,
        y: this.position.y,
        facing: this.facing
      });
    }
  };

  var RemotePlayer = function (game, charObj) {
    Phaser.Sprite.call(this, game, charObj.x, charObj.y, 'guy', 0);
    game.physics.arcade.enable(this);
    this.name = charObj.name;
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(gs, gs);
    this.nameText = game.add.bitmapText(
      0, -14, 'fontOL', this.name, 16);
    this.nameText.anchor.setTo(0.5, 1);
    this.tint = charObj.color;
    this.nameText.tint = charObj.nameCol;
    this.addChild(this.nameText);
    this.animations.add('down', [0,1,0,2], 10,  true);
    this.animations.add('left', [5,3,5,4], 10, true);
    this.animations.add('right', [6,7,6,8], 10, true);
    this.animations.add('up', [9,10,9,11], 10, true);

    // Relating to movement...
    this.previousPosition = new Phaser.Point(this.position.x, this.position.y);
    this.distanceToCover = null;
    this.distanceCovered = null;
    this.targetPosition = null;
    this.lastMoveTime = null;

    // Add to game
    game.add.existing(this);
  };
  RemotePlayer.prototype = Object(Phaser.Sprite.prototype);
  RemotePlayer.prototype.interpolate = function(lastFrameTime) {
    var remotePlayerUpdateInterval = 100;
    if(this.distanceToCover && lastFrameTime) {
      if((this.distanceCovered.x < Math.abs(this.distanceToCover.x) || this.distanceCovered.y < Math.abs(this.distanceToCover.y))) {
        var fractionOfTimeStep = (game.time.now - lastFrameTime) / remotePlayerUpdateInterval;
        var distanceCoveredThisFrameX = fractionOfTimeStep * this.distanceToCover.x;
        var distanceCoveredThisFrameY = fractionOfTimeStep * this.distanceToCover.y;

        this.distanceCovered.x += Math.abs(distanceCoveredThisFrameX);
        this.distanceCovered.y += Math.abs(distanceCoveredThisFrameY);

        this.position.x += distanceCoveredThisFrameX;
        this.position.y += distanceCoveredThisFrameY;

        switch (this.facing) {
          case 1: this.animations.play('up'); break;
          case 2: this.animations.play('right'); break;
          case 3: this.animations.play('down'); break;
          case 4: this.animations.play('left'); break;
          default: this.animations.play('down');
        }

      } else {
        this.position.x = this.targetPosition.x;
        this.position.y = this.targetPosition.y;

        this.animations.stop(); // Stop the animation
        // Set the player frame to stand still
        switch (this.facing) {
          case 1: this.frame = 9; break;
          case 2: this.frame = 6; break;
          case 3: this.frame = 0; break;
          case 4: this.frame = 5; break;
          default: this.frame = 0;
        }
      }
    }
  };

  var transferPlayer = function(game) {
    socket.on('transferPlayer', function(otherPlayer){
      game[otherPlayer.name] = new RemotePlayer(game, otherPlayer);
      remotePlayers[otherPlayer.name] = game[otherPlayer.name];
    })
  };

  var getOthers = function(game) {
    socket.emit('getOthers');
    socket.on('giveOthers', function(charListObj) {

      for (var charObj in charListObj) {
        console.log(charListObj);
        game[charObj] = new RemotePlayer(game, charListObj[charObj]);
        remotePlayers[charObj] = game[charObj];
      }
    });
  };

  var setUpButtons = function() {

    // Set up empty character object to create player with and send to the server
    char = {
      name: $rootScope.currentUser.username,
      color: 0xffffff,
      nameCol: 0xffffff,
      x: Math.floor((Math.random() * (296 - 24 + 1)) + 24) * gs,
      y: Math.floor((Math.random() * (184 - 16 + 1)) + 16) * gs
    };

    game.colorBtn = game.add.sprite(game.defPos.x, game.defPos.y + 40 * gs, 'colorBtn');
    game.colorBtn.anchor.setTo(0.5, 0.5);
    game.colorBtn.scale.x = gs;
    game.colorBtn.scale.y = gs;
    game.colorBtn.inputEnabled = true;
    game.colorBtn.buttonMode = true;
    game.colorBtn.events.onInputDown.add(function(){
      var color = Math.floor(Math.random() * 0xffffff);
      var nameCol = Math.floor(Math.random() * 0xffffff);
      game.charCreator.tint = color;
      game.charCreator.nameText.tint = nameCol;
      game.colorBtn.tint = color;
      char.color = color;
      char.nameCol = nameCol;
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

  //Add game states
  game.state.add('boot', bootState);
  game.state.add('load', loadState);
  game.state.add('title', titleState);
  game.state.add('menu', menuState);
  game.state.add('play', playState);

  // Angular-accessible methods
  this.start = function() {
    game.state.start('boot');
  };

  this.reset = function() {
    if (socket) socket.disconnect();
    game.state.clearCurrentState();
    game.state.start('boot');
  };

});