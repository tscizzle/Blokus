'use strict';

var transform = require('./blokus/transform');
var flip = transform.flip,
    rotate = transform.rotate;

var blokus = require('./blokus/blokus');
var game = require('./game/game');

module.exports = {
  transform: transform,
  blokus: blokus,
  game: game
};