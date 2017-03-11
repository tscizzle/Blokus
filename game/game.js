const _ = require('lodash');

const blokus = require('../blokus/blokus');


const Game = (options = {}) => {
  /*
   * Internal objects
   */

  const gameBlokus = blokus(options);
  const turns = [];

  /*
   * Methods
   */

  const currentPlayer = function() {
    const turns = this.turns();
    return turns.length > 0 ? (turns[turns.length - 1].player + 1) % 4 : 0;
  };

  const place = function({piece, flipped = false, rotations = 0, position, probe = false}) {
    const player = this.currentPlayer();
    const placement = {player, piece, flipped, rotations, position, probe};

    const placementResult = gameBlokus._place(placement);
    if (!probe) {
      if (placementResult.success) {
        const turn = _.cloneDeep(_.omit(placement, 'probe'));
        turns.push(turn);
      }
    }
    return placementResult;
  };

  /*
   * Game API
   */

  return {
    players: gameBlokus.players,
    pieces: gameBlokus.pieces,
    board: gameBlokus.board,
    turns: () => _.cloneDeep(turns),
    currentPlayer,
    availablePieces: gameBlokus.availablePieces,
    place,
  };
};


module.exports = Game;
