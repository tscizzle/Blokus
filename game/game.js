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

    if (_.every(players, 'hasPassed')) {
      return null;
    }

    let playerID = turns.length > 0 ? (turns[turns.length - 1].player + 1) % 4 : 0;
    let player = _.find(players, {id: playerID});
    while (player.hasPassed) {
      playerID = (playerID + 1) % 4;
      player = _.find(players, {id: playerID});
    }
    return player;
  };

  const place = function({piece, flipped = false, rotations = 0, position, probe = false, _isPass = false}) {
    const placement = {player: this.currentPlayer().id, piece, flipped, rotations, position, probe, isPass: _isPass};

    const placementResult = _isPass ? {success: true} : gameBlokus.place(placement);
    if (!probe) {
      if (placementResult.success) {
        const turn = _.cloneDeep(placement);
        turns.push(turn);
      }
    }
    return placementResult;
  };

  const pass = function() {
    const currentPlayer = this.currentPlayer();
    const placement = {piece: null, flipped: null, rotations: null, position: null, _isPass: true};
    const placementResult = this.place(placement);

    gameBlokus.setPlayerPassed({player: currentPlayer.id});

    return placementResult;
  };

  const isOver = function() {
    return _.isNull(this.currentPlayer());
  };

  const numRemaining = function({player}) {
    const pieces = this.availablePieces({player});
    const totalCells = _.sumBy(pieces, 'numCells');
    return totalCells;
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
    pass,
    isOver,
    numRemaining,
  };
};


module.exports = Game;
