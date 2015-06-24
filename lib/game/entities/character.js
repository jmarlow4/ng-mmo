function Character () {
  this.initialized = false;
  this.color = 0xffffff;
  this.name = '';
}

Character.prototype.init = function (name, color) {
  this.initialized = true;
  this.name = name;
  this.color = color;
};

module.exports = Character;
