'use strict';

var _require;

var transform = (_require = require('./blokus/transform'), flip = _require.flip, rotate = _require.rotate, _require);
var blokus = require('./blokus/blokus');
var game = require('./game/game');

module.exports = {
  transform: transform,
  blokus: blokus,
  game: game
};