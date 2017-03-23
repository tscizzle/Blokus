'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _ = require('lodash');

var _require = require('./pieces'),
    pieceCollection = _require.pieceCollection;

var processOptions = function processOptions(_ref) {
  var _ref$height = _ref.height,
      height = _ref$height === undefined ? 20 : _ref$height,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 20 : _ref$width,
      _ref$players = _ref.players,
      players = _ref$players === undefined ? [] : _ref$players;

  players = _.map(_.range(4), function (playerID) {
    return { id: playerID, name: players[playerID] || 'Player ' + playerID, hasPassed: false };
  });
  return { height: height, width: width, players: players };
};

var generatePieces = function generatePieces() {
  var pieces = _.reduce(_.range(4), function (piecesSoFar, playerID) {
    var playerPieces = pieceCollection();
    _.each(playerPieces, function (piece, pieceID) {
      piece.id = pieceID;
      piece.player = playerID;
      piece.used = false;
    });
    piecesSoFar.push.apply(piecesSoFar, _toConsumableArray(playerPieces));
    return piecesSoFar;
  }, []);
  return pieces;
};

var generateBoard = function generateBoard(height, width) {
  return _.map(_.range(height), function (rowIdx) {
    return _.map(_.range(width), function (colIdx) {
      return null;
    });
  });
};

module.exports = {
  processOptions: processOptions,
  generatePieces: generatePieces,
  generateBoard: generateBoard
};