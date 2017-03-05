const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');

const blokus = require('../blokus');


const assertExpectedPositions = (board, expectedPositions) => {
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
  b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
  const pieces = b.pieces();
  const board = b.board();
  const turns = b.turns();

  it('should place a piece in the right position', function() {
    const expectedPositions = [{row: 0, col: 0}];
    assertExpectedPositions(board, expectedPositions);
  });

  it('should place the right player\'s piece', function() {
    assert.equal(board[0][0], 0);
  });

  it('should save the placement as a turn', function() {
    assert.lengthOf(turns, 1);
    assert.deepEqual(turns, [
      {player: 0, piece: 0, flipped: false, rotations: 0, position: {row: 0, col: 0}},
    ]);
  });

  it('should mark the piece as used', function() {
    const matchingPiece = _.find(pieces, {player: 0, id: 0});
    assert.isTrue(matchingPiece.used);
  });

  it('should not be able to place a piece that doesn\'t exist', function() {
    assert.throws(() => b.place({player: 0, piece: 100, position: {row: 1, col: 1}}), 'PieceDoesNotExist');
  });

  it('should not be able to place a piece that was already used', function() {
    assert.throws(() => b.place({player: 0, piece: 0, position: {row: 1, col: 1}}), 'PieceAlreadyUsed');
  });

  it('should not be able to place a piece with any cells out of bounds', function() {
    assert.throws(() => b.place({player: 0, piece: 1, position: {row: 19, col: 0}}), 'OutOfBounds');
  });

  it('should not be able to place a piece on top of another piece', function() {
    assert.throws(() => b.place({player: 0, piece: 1, position: {row: 0, col: 0}}), 'Taken');
  });
});

describe('taking a first turn', function() {
  const b = blokus();

  it('should not be able to place a piece anywhere but the corner', function() {
    assert.throws(() => b.place({player: 0, piece: 0, position: {row: 1, col: 0}}), 'NotInCorner');
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
    const placementHappened = b.place({player: 0, piece: 1, position: {row: 1, col: 1}});
    assert.isTrue(placementHappened);
  });

  it('should not be able to place a piece somewhere not diagonal from one of the player\'s previous pieces', function() {
    assert.throws(() => b.place({player: 1, piece: 1, position: {row: 1, col: 17}}), 'NotDiagonalFromSamePlayer');
  });

  it('should not be able to place a piece that shares a border with one of the player\'s previous pieces', function() {
    assert.throws(() => b.place({player: 1, piece: 1, position: {row: 0, col: 18}}), 'AdjacentToSamePlayer');
  });
});

describe('placing a transformed piece', function() {
  describe('flipping', function() {
    it('should reflect the piece horizontally', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      b.place({player: 0, piece: 18, flipped: true, position: {row: 1, col: 0}});
      const board = b.board();

      const expectedPositions = [
        {row: 0, col: 0},
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 2, col: 1},
        {row: 2, col: 2},
        {row: 3, col: 2},
      ];
      assertExpectedPositions(board, expectedPositions);
    });
  });

  describe('rotating', function() {
    it('should rotate the piece a quarter rotation counterclockwise', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      b.place({player: 0, piece: 18, rotations: 1, position: {row: 0, col: 1}});
      const board = b.board();

      const expectedPositions = [
        {row: 0, col: 0},
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 2, col: 1},
        {row: 2, col: 2},
        {row: 2, col: 3},
      ];
      assertExpectedPositions(board, expectedPositions);
    });

    it('should be able to do multiple rotations', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      b.place({player: 0, piece: 18, rotations: 2, position: {row: 0, col: 0}});
      const board = b.board();

      const expectedPositions = [
        {row: 0, col: 0},
        {row: 0, col: 2},
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 2, col: 1},
        {row: 2, col: 2},
      ];
      assertExpectedPositions(board, expectedPositions);
    });

    it('should be able to do negative rotations', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      b.place({player: 0, piece: 18, rotations: -1, position: {row: 1, col: 1}});
      const board = b.board();

      const expectedPositions = [
        {row: 0, col: 0},
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 1, col: 3},
        {row: 2, col: 2},
        {row: 2, col: 3},
      ];
      assertExpectedPositions(board, expectedPositions);
    });
  });

  describe('flipping and rotating a piece', function() {
    it('should first flip a piece and then rotate it (this order matters)', function() {
      const b = blokus();
      b.place({player: 0, piece: 0, position: {row: 0, col: 0}});
      b.place({player: 0, piece: 18, flipped: true, rotations: 1, position: {row: 1, col: 1}});
      const board = b.board();

      const expectedPositions = [
        {row: 0, col: 0},
        {row: 1, col: 1},
        {row: 1, col: 2},
        {row: 1, col: 3},
        {row: 2, col: 1},
        {row: 2, col: 2},
      ];
      assertExpectedPositions(board, expectedPositions);
    });
  });
});

/* perhaps wait to test these until the new `game` object exists */
// TODO: test currentPlayer
// TODO: test availablePieces
