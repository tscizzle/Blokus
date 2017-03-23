const transform = require('./blokus/transform');
const { flip, rotate } = transform;
const blokus = require('./blokus/blokus');
const game = require('./game/game');


module.exports = {
  transform,
  blokus,
  game,
};
