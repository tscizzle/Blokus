'use strict';

var _ = require('lodash');

var _require = require('./initialize'),
    processOptions = _require.processOptions,
    generatePieces = _require.generatePieces,
    generateBoard = _require.generateBoard;

var _require2 = require('./placement'),
    getPlaceFunction = _require2.getPlaceFunction;

var Blokus = function Blokus() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _processOptions = processOptions(options),
      height = _processOptions.height,
      width = _processOptions.width,
      _players = _processOptions.players;

  /*
   * Internal objects
   */

  var _pieces = generatePieces();
  var _board = generateBoard(height, width);

  /*
   * Methods
   */

  var place = getPlaceFunction(_pieces, _board);

  var availablePieces = function availablePieces(_ref) {
    var player = _ref.player,
        numCells = _ref.numCells;

    var pieceFilter = { player: player, 'used': false };
    if (_.isNumber(numCells)) {
      pieceFilter.numCells = numCells;
    }
    return _.filter(this.pieces(), pieceFilter);
  };

  var setPlayerPassed = function setPlayerPassed(_ref2) {
    var player = _ref2.player;

    var playerThatPassed = _.find(_players, { id: player });
    playerThatPassed.hasPassed = true;
  };

  /*
   * Blokus API
   */

  return {
    players: function players() {
      return _.cloneDeep(_players);
    },
    pieces: function pieces() {
      return _.cloneDeep(_pieces);
    },
    board: function board() {
      return _.cloneDeep(_board);
    },
    place: place,
    availablePieces: availablePieces,
    setPlayerPassed: setPlayerPassed
  };
};

module.exports = Blokus;