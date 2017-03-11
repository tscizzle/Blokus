const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');


const assertPositionsEqual = (positions, expectedPositions) => {
  assert.deepEqual(_.sortBy(positions, ['row', 'col']), _.sortBy(expectedPositions, ['row', 'col']));
};

const assertBoardState = (board, expectedPositions) => {
  _.each(board, (row, rowIdx) => _.each(row, (cell, colIdx) => {
    const positionMsg = `for position (${rowIdx}, ${colIdx})`;
    if (!_.isUndefined(_.find(expectedPositions, {row: rowIdx, col: colIdx}))) assert.isNotNull(cell, positionMsg)
    else assert.isNull(cell, positionMsg)
  }));
};


module.exports = {
  assertPositionsEqual,
  assertBoardState,
};
