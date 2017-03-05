const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');

const blokus = require('../blokus');


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


describe('instantiating a blokus', function() {
  it('should make a blokus', function() {
    const b = blokus();

    assert.isOk(b);
  });

  describe('players', function() {
    it('should have the right default players', function() {
      const b = blokus();
      const players = b.players();

      assert.lengthOf(players, 4);
      assert.deepEqual(players, [
        {id: 0, name: 'Player 0'},
        {id: 1, name: 'Player 1'},
        {id: 2, name: 'Player 2'},
        {id: 3, name: 'Player 3'},
      ]);
    });

    it('should have the passed in players and fill in the remaining spots with default players', function() {
      const b = blokus({height: 10, width: 4, players: ['Jill', 'Bob']});
      const players = b.players();

      assert.lengthOf(players, 4);
      assert.deepEqual(players, [
        {id: 0, name: 'Jill'},
        {id: 1, name: 'Bob'},
        {id: 2, name: 'Player 2'},
        {id: 3, name: 'Player 3'},
      ]);
    });
  });

  describe('pieces', function() {
    const b = blokus();
    const pieces = b.pieces();

    it('should have the right pieces', function() {
      assert.lengthOf(pieces, 84);
      _.each(_.range(4), playerID => {
        const playerPieces = _.filter(pieces, ['player', playerID]);
        assert.lengthOf(playerPieces, 21);
        assert.lengthOf(_.filter(playerPieces, ['numCells', 1]), 1);
        assert.lengthOf(_.filter(playerPieces, ['numCells', 2]), 1);
        assert.lengthOf(_.filter(playerPieces, ['numCells', 3]), 2);
        assert.lengthOf(_.filter(playerPieces, ['numCells', 4]), 5);
        assert.lengthOf(_.filter(playerPieces, ['numCells', 5]), 12);
      });
    });

    it('should start with every piece marked as not yet used', function() {
      _.each(pieces, piece => assert.isFalse(piece.used));
    });
  });

  describe('board', function() {
    const b = blokus();
    const board = b.board();
    const tallSkinnyB = blokus({height: 10, width: 1});
    const tallSkinnyBoard = tallSkinnyB.board();
    const shortFatB = blokus({height: 1, width: 10});
    const shortFatBoard = shortFatB.board();

    it('should have the right default dimensions', function() {
      assert.lengthOf(board, 20);
      _.each(board, row => assert.lengthOf(row, 20));
    });

    it('should have the passed in dimensions', function() {
      assert.lengthOf(tallSkinnyBoard, 10);
      _.each(tallSkinnyBoard, row => assert.lengthOf(row, 1));

      assert.lengthOf(shortFatBoard, 1);
      _.each(shortFatBoard, row => assert.lengthOf(row, 10));
    });

    it('should start with an empty board', function() {
      _.each(board, row => _.each(row, cell => assert.isNull(cell)));
    });
  });

  describe('turns', function() {
    it('should start with no turns', function() {
      const b = blokus();
      const turns = b.turns();

      assert.lengthOf(turns, 0);
      assert.deepEqual(turns, []);
    });
  });
});

describe('taking a turn', function() {
  const b = blokus();
  const { success, positions } = b.place({player: 0, piece: 3, position: {row: 0, col: 0}});
  const pieces = b.pieces();
  const board = b.board();
  const turns = b.turns();

  it('should be able to place a piece', function() {
    assert.isTrue(success);
  });

  it('should place a piece in the right position', function() {
    const expectedPositions = [
      {row: 0, col: 0},
      {row: 1, col: 0},
      {row: 1, col: 1},
    ];
    assertPositionsEqual(positions, expectedPositions);
    assertBoardState(board, expectedPositions);
  });

  it('should place the right player\'s piece', function() {
    _.each(positions, ({row, col}) => assert.equal(board[row][col], 0));
  });

  it('should save the placement as a turn', function() {
    assert.lengthOf(turns, 1);
    assert.deepEqual(turns, [
      {player: 0, piece: 3, flipped: false, rotations: 0, position: {row: 0, col: 0}},
    ]);
  });

  it('should mark the piece as used', function() {
    const matchingPiece = _.find(pieces, {player: 0, id: 3});
    assert.isTrue(matchingPiece.used);
  });

  it('should not be able to place a piece that doesn\'t exist', function() {
    const oldBoard = b.board();
    const { failure, message } = b.place({player: 0, piece: 100, position: {row: 1, col: 1}});
    const newBoard = b.board();

    assert.isTrue(failure);
    assert.equal(message, 'PieceDoesNotExist');
    assert.deepEqual(oldBoard, newBoard);
  });

  it('should not be able to place a piece that was already used', function() {
    const oldBoard = b.board();
    const { failure, message } = b.place({player: 0, piece: 3, position: {row: 1, col: 1}});
    const newBoard = b.board();

    assert.isTrue(failure);
    assert.equal(message, 'PieceAlreadyUsed');
    assert.deepEqual(oldBoard, newBoard);
  });

  it('should not be able to place a piece with any cells out of bounds', function() {
    const oldBoard = b.board();
    const { failure, message } = b.place({player: 0, piece: 1, position: {row: 19, col: 0}});
    const newBoard = b.board();

    assert.isTrue(failure);
    assert.equal(message, 'OutOfBounds');
    assert.deepEqual(oldBoard, newBoard);
  });

  it('should not be able to place a piece on top of another piece', function() {
    const oldBoard = b.board();
    const { failure, message } = b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
    const newBoard = b.board();

    assert.isTrue(failure);
    assert.equal(message, 'Taken');
    assert.deepEqual(oldBoard, newBoard);
  });
});

describe('taking a first turn', function() {
  const b = blokus();

  it('should not be able to place a piece anywhere but the corner', function() {
    const oldBoard = b.board();
    const { failure, message } = b.place({player: 0, piece: 0, position: {row: 1, col: 0}});
    const newBoard = b.board();

    assert.isTrue(failure);
    assert.equal(message, 'NotInCorner');
    assert.deepEqual(oldBoard, newBoard);
  });
});

describe('taking a subsequent turn', function() {
  const b = blokus();
  const placements = [
    {player: 0, piece: 0, position: {row: 0, col: 0}},
    {player: 1, piece: 0, position: {row: 0, col: 19}},
    {player: 2, piece: 0, position: {row: 19, col: 19}},
    {player: 3, piece: 0, position: {row: 19, col: 0}},
  ];
  _.each(placements, b.place);

  it('should be able to place a piece diagonal from one of the player\'s previous pieces', function() {
    const { success } = b.place({player: 0, piece: 1, position: {row: 1, col: 1}});
    assert.isTrue(success);
  });

  it('should not be able to place a piece somewhere not diagonal from one of the player\'s previous pieces', function() {
    const oldBoard = b.board();
    const { failure, message } = b.place({player: 1, piece: 1, position: {row: 1, col: 17}});
    const newBoard = b.board();

    assert.isTrue(failure);
    assert.equal(message, 'NotDiagonalFromSamePlayer');
    assert.deepEqual(oldBoard, newBoard);
  });

  it('should not be able to place a piece that shares a border with one of the player\'s previous pieces', function() {
    const oldBoard = b.board();
    const { failure, message } = b.place({player: 1, piece: 1, position: {row: 0, col: 18}});
    const newBoard = b.board();

    assert.isTrue(failure);
    assert.equal(message, 'AdjacentToSamePlayer');
    assert.deepEqual(oldBoard, newBoard);
  });
});

describe('probing a placement', function() {
  const b = blokus();

  it('should give the usual success response but not change the game state', function() {
    const oldPieces = b.pieces();
    const oldBoard = b.board();
    const oldTurns = b.turns();
    const { success, positions } = b.place({player: 0, piece: 3, position: {row: 0, col: 0}, probe: true});
    const newPieces = b.pieces();
    const newBoard = b.board();
    const newTurns = b.turns();

    assert.isTrue(success);
    const expectedPositions = [
      {row: 0, col: 0},
      {row: 1, col: 0},
      {row: 1, col: 1},
    ];
    assertPositionsEqual(positions, expectedPositions);
    assert.deepEqual(oldPieces, newPieces);
    assert.deepEqual(oldBoard, newBoard);
    assert.deepEqual(oldTurns, newTurns);
  });

  it('should give the usual failure response', function() {
    const oldPieces = b.pieces();
    const oldBoard = b.board();
    const oldTurns = b.turns();
    const { failure, message } = b.place({player: 0, piece: 3, position: {row: 20, col: 0}, probe: true});
    const newPieces = b.pieces();
    const newBoard = b.board();
    const newTurns = b.turns();

    assert.isTrue(failure);
    assert.equal(message, 'OutOfBounds');
  });
});

describe('placing a transformed piece', function() {
  describe('flipping', function() {
    it('should reflect the piece horizontally', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      const { positions } = b.place({player: 0, piece: 18, flipped: true, position: {row: 1, col: 0}});

      const expectedPositions = [
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 2, col: 1},
        {row: 2, col: 2},
        {row: 3, col: 2},
      ];
      assertPositionsEqual(positions, expectedPositions);
    });
  });

  describe('rotating', function() {
    it('should rotate the piece a quarter rotation counterclockwise', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      const { positions } = b.place({player: 0, piece: 18, rotations: 1, position: {row: 0, col: 1}});

      const expectedPositions = [
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 2, col: 1},
        {row: 2, col: 2},
        {row: 2, col: 3},
      ];
      assertPositionsEqual(positions, expectedPositions);
    });

    it('should be able to do multiple rotations', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      const { positions } = b.place({player: 0, piece: 18, rotations: 2, position: {row: 0, col: 0}});

      const expectedPositions = [
        {row: 0, col: 2},
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 2, col: 1},
        {row: 2, col: 2},
      ];
      assertPositionsEqual(positions, expectedPositions);
    });

    it('should be able to do negative rotations', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      const { positions } = b.place({player: 0, piece: 18, rotations: -1, position: {row: 1, col: 1}});

      const expectedPositions = [
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 1, col: 3},
        {row: 2, col: 2},
        {row: 2, col: 3},
      ];
      assertPositionsEqual(positions, expectedPositions);
    });
  });

  describe('flipping and rotating a piece', function() {
    it('should first flip a piece and then rotate it (this order matters)', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      const { positions } = b.place({player: 0, piece: 18, flipped: true, rotations: 1, position: {row: 1, col: 1}});

      const expectedPositions = [
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 1, col: 3},
        {row: 2, col: 1},
        {row: 2, col: 2},
      ];
      assertPositionsEqual(positions, expectedPositions);
    });
  });
});

/* perhaps wait to test these until the new `game` object exists */
// TODO: test currentPlayer
// TODO: test availablePieces