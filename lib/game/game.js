'use strict';

var _ = require('lodash');

var blokus = require('../blokus/blokus');

var Game = function Game() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  /*
   * Internal objects
   */

  var gameBlokus = blokus(options);
  var _turns = [];

  /*
   * Methods
   */

  var currentPlayer = function currentPlayer() {
    var turns = this.turns();
    var players = gameBlokus.players();

    if (_.every(players, 'hasPassed')) {
      return null;
    }

    var playerID = turns.length > 0 ? (turns[turns.length - 1].player + 1) % 4 : 0;
    var player = _.find(players, { id: playerID });
    while (player.hasPassed) {
      playerID = (playerID + 1) % 4;
      player = _.find(players, { id: playerID });
    }
    return player;
  };

  var place = function place(_ref) {
    var piece = _ref.piece,
        _ref$flipped = _ref.flipped,
        flipped = _ref$flipped === undefined ? false : _ref$flipped,
        _ref$rotations = _ref.rotations,
        rotations = _ref$rotations === undefined ? 0 : _ref$rotations,
        position = _ref.position,
        _ref$probe = _ref.probe,
        probe = _ref$probe === undefined ? false : _ref$probe,
        _ref$_isPass = _ref._isPass,
        _isPass = _ref$_isPass === undefined ? false : _ref$_isPass;

    var placement = { player: this.currentPlayer().id, piece: piece, flipped: flipped, rotations: rotations, position: position, probe: probe, isPass: _isPass };

    var placementResult = _isPass ? { success: true } : gameBlokus.place(placement);
    if (!probe) {
      if (placementResult.success) {
        var turn = _.cloneDeep(placement);
        _turns.push(turn);
      }
    }
    return placementResult;
  };

  var pass = function pass() {
    var currentPlayer = this.currentPlayer();
    var placement = { piece: null, flipped: null, rotations: null, position: null, _isPass: true };
    var placementResult = this.place(placement);

    gameBlokus.setPlayerPassed({ player: currentPlayer.id });

    return placementResult;
  };

  var isOver = function isOver() {
    return _.isNull(this.currentPlayer());
  };

  var numRemaining = function numRemaining(_ref2) {
    var player = _ref2.player;

    var pieces = this.availablePieces({ player: player });
    var totalCells = _.sumBy(pieces, 'numCells');
    return totalCells;
  };

  /*
   * Game API
   */

  return {
    players: gameBlokus.players,
    pieces: gameBlokus.pieces,
    board: gameBlokus.board,
    turns: function turns() {
      return _.cloneDeep(_turns);
    },
    availablePieces: gameBlokus.availablePieces,
    currentPlayer: currentPlayer,
    place: place,
    pass: pass,
    isOver: isOver,
    numRemaining: numRemaining
  };
};

module.exports = Game;