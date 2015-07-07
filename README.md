# ng-mmo

A multiplayer game platform built with Node, Express, MongoDB, Angular and Phaser. The idea is to create a starting point for anyone interested in creating a robust website for a game that also includes the game itself.
### What's in this repo?
The ng-mmo platform, including the back end Node server, the front end Angular app, as well as the game itself.

This is based off of DaftMonk's [Angular-Passport](https://github.com/DaftMonk/angular-passport) project, Krimple's [Angular-Flavored-Chat](https://github.com/krimple/angular-socketio-chat) project, and ahung89's [Bomb-Arena](https://github.com/ahung89/bomb-arena) game.

### Setting up
Open your terminal and run <pre><code>npm install</pre></code> and <pre><code>bower install</pre></code> in the console. To start it up enter <pre><code>node server</pre></code> and it'll run in http://localhost:8000

### Quick note
I've avoided the use of generators and task runners specifcally to help people see exactly what's going on. This platform was created to be a starting point that even beginners can use to build multiplayer games with Node, Angular, and Phaser without too much work setting up. And you don't even have to use Phaser. This platform is game framework-agnostic.

### Demo
[Check it out here](http://ng-mmo.cloudapp.net/)