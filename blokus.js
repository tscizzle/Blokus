const _ = require('lodash');

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
   * State-modifying methods (need to be able to reference the internal objects directly)
   */

  const place = getPlaceFunction(pieces, board, turns);

  /*
   * Read-only methods
   * - only reference `this`, instead of the internal objects directly
   * - for `this` to be the blokus instance, use function keyword instead of arrow functions
   */

  const availablePieces = function({player}) {
    _.filter(this.pieces(), {player, 'used': false});
  };

  const look = function() {
    const getCellString = cell => !_.isNull(cell) ? cell : '-';
    const getRowString = row => _.map(row, getCellString).join(' ');
    const boardString = '[ ' + _.map(this.board(), getRowString).join(' ]\n[ ') + ' ]';
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
    availablePieces,
    place,
    look,
  };
};


module.exports = Blokus;
