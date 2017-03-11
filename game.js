const _ = require('lodash');

const blokus = require('./blokus');


const Game = (options = {}) => {
  /*
   * Internal objects
   */

  const gameBlokus = blokus(options);

  /*
   * Methods
   */

  const currentPlayer = () => {
    const turns = gameBlokus.turns();
    return turns.length > 0 ? (turns[turns.length - 1].player + 1) % 4 : 0;
  };

  const place = ({piece, flipped = false, rotations = 0, position, probe = false}) => {
    const placement = {piece, flipped, rotations, position, probe};
    placement.player = currentPlayer();
    return gameBlokus.place(placement);
  };

  /*
   * Game API
   */

  return {
    blokus: gameBlokus,
    currentPlayer,
    place,
  };
};


module.exports = Game;
