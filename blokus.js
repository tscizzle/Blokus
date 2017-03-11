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
   * Methods
   */

  const place = getPlaceFunction(pieces, board, turns);

  const look = function() {
    const playerBackgrounds = ['bgGreen', 'bgRed', 'bgBlue', 'bgYellow'];
    const playerColors = ['green', 'red', 'blue', 'yellow'];
    const coloredPlayerCell = cell => colors[playerBackgrounds[cell]][playerColors[cell]]('  ');
    const nullCell = '()'.bgWhite.black;

    const getCellString = cell => !_.isNull(cell) ? coloredPlayerCell(cell) : nullCell;
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
    place,
    look,
  };
};


module.exports = Blokus;
