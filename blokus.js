const _ = require('lodash');
const colors = require('colors');

const { processOptions,
        generatePieces,
        generateBoard    } = require('./initialize');
const { getPlaceFunction } = require('./placement');


const Blokus = (options = {}) => {
  const { height, width, players } = processOptions(options);

  /*
   * Internal objects
   */

  const pieces = generatePieces();
  const board = generateBoard(height, width);
  const turns = [];

  /*
   * State-modifying methods
   * - need to be able to reference the internal objects directly
   */

  const place = getPlaceFunction(pieces, board, turns);

  /*
   * Helpful read-only methods
   * - only reference `this`, instead of the internal objects directly
   * - for `this` to be the blokus instance, use function keyword instead of arrow functions
   */

  const currentPlayer = function() {
    const turns = this.turns();
    return turns.length > 0 ? (turns[turns.length - 1].player + 1) % 4 : 0;
  };

  const availablePieces = function({player, numCells}) {
    const pieceFilter = {player, 'used': false};
    if (_.isNumber(numCells)) {
      pieceFilter.numCells = numCells;
    }
    return _.filter(this.pieces(), pieceFilter);
  };

  const look = function() {
    const playerBackgrounds = ['bgGreen', 'bgRed', 'bgBlue', 'bgYellow'];
    const playerColors = ['green', 'red', 'blue', 'yellow'];
    const colorPlayerCell = cell => colors[playerBackgrounds[cell]][playerColors[cell]]('  ');
    const nullCell = '()'.bgWhite.black;

    const getCellString = cell => !_.isNull(cell) ? colorPlayerCell(cell) : nullCell;
    const getRowString = row => _.map(row, getCellString).join('');
    const boardString = _.map(this.board(), getRowString).join('\n');
    console.log(boardString);
  };

  /*
   * Blokus API
   */

  return {
    players: () => _.cloneDeep(players),
    pieces: () => _.cloneDeep(pieces),
    board: () => _.cloneDeep(board),
    turns: () => _.cloneDeep(turns),
    currentPlayer,
    availablePieces,
    place,
    look,
  };
};


module.exports = Blokus;
