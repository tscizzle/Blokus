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
    const players = gameBlokus.players();
    const playerID = turns.length > 0 ? (turns[turns.length - 1].player + 1) % 4 : 0;
    const player = _.find(players, {id: playerID});
    return player;
  };

  const place = function({piece, flipped = false, rotations = 0, position, probe = false, isPass = false}) {
    const currentPlayer = this.currentPlayer();

    if (currentPlayer.hasPassed) {
      return {failure: true, message: 'PlayerHasPassed'};
    }

    const placement = {player: currentPlayer.id, piece, flipped, rotations, position, probe, isPass};

    const placementResult = isPass ? {success: true} : gameBlokus.place(placement);
    if (!probe) {
      if (placementResult.success) {
        const turn = _.cloneDeep(placement);
        turns.push(turn);
      }
    }
    return placementResult;
  };

  const pass = function() {
    const placement = {piece: null, flipped: null, rotations: null, position: null, isPass: true};
    this.place(placement);

    gameBlokus.setPlayerPassed({player: this.currentPlayer().id});
  };

  /*
   * Game API
   */

  return {
    players: gameBlokus.players,
    pieces: gameBlokus.pieces,
    board: gameBlokus.board,
    turns: () => _.cloneDeep(turns),
    availablePieces: gameBlokus.availablePieces,
    currentPlayer,
    place,
  };
};


module.exports = Game;
