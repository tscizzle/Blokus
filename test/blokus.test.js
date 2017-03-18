const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');

const { assertPositionsEqual,
        assertBoardState,     } = require('./testHelpers');
const blokus = require('../blokus/blokus');


describe('blokus.js', function() {

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
  });

  describe('making a placement', function() {

    const b = blokus();
    const { success, positions } = b._place({player: 0, piece: 3, position: {row: 0, col: 0}});
    const pieces = b.pieces();
    const board = b.board();

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

    it('should mark the piece as used', function() {
      const matchingPiece = _.find(pieces, {player: 0, id: 3});
      assert.isTrue(matchingPiece.used);
    });

    it('should not be able to place a piece that doesn\'t exist', function() {
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 0, piece: 100, position: {row: 1, col: 1}});
      const newBoard = b.board();

      assert.isTrue(failure);
      assert.equal(message, 'PieceDoesNotExist');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece that was already used', function() {
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 0, piece: 3, position: {row: 1, col: 1}});
      const newBoard = b.board();

      assert.isTrue(failure);
      assert.equal(message, 'PieceAlreadyUsed');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece with any cells out of bounds', function() {
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 0, piece: 1, position: {row: 19, col: 0}});
      const newBoard = b.board();

      assert.isTrue(failure);
      assert.equal(message, 'OutOfBounds');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece on top of another piece', function() {
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 0, piece: 0, position: {row: 0, col: 0}});
      const newBoard = b.board();

      assert.isTrue(failure);
      assert.equal(message, 'Taken');
      assert.deepEqual(oldBoard, newBoard);
    });

  });

  describe('making a first placement', function() {

    const b = blokus();

    it('should not be able to place a piece anywhere but the corner', function() {
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 0, piece: 0, position: {row: 1, col: 0}});
      const newBoard = b.board();

      assert.isTrue(failure);
      assert.equal(message, 'NotInCorner');
      assert.deepEqual(oldBoard, newBoard);
    });

  });

  describe('making a subsequent placement', function() {

    const b = blokus();
    const placements = [
      {player: 0, piece: 0, position: {row: 0, col: 0}},
      {player: 1, piece: 0, position: {row: 0, col: 19}},
      {player: 2, piece: 0, position: {row: 19, col: 19}},
      {player: 3, piece: 0, position: {row: 19, col: 0}},
    ];
    _.each(placements, placement => b._place(placement));

    it('should be able to place a piece diagonal from one of the player\'s previous pieces', function() {
      const { success } = b._place({player: 0, piece: 1, position: {row: 1, col: 1}});
      assert.isTrue(success);
    });

    it('should not be able to place a piece somewhere not diagonal from one of the player\'s previous pieces', function() {
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 1, piece: 1, position: {row: 1, col: 17}});
      const newBoard = b.board();

      assert.isTrue(failure);
      assert.equal(message, 'NotDiagonalFromSamePlayer');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece that shares a border with one of the player\'s previous pieces', function() {
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 1, piece: 1, position: {row: 0, col: 18}});
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
      const { success, positions } = b._place({player: 0, piece: 3, position: {row: 0, col: 0}, probe: true});
      const newPieces = b.pieces();
      const newBoard = b.board();

      assert.isTrue(success);
      const expectedPositions = [
        {row: 0, col: 0},
        {row: 1, col: 0},
        {row: 1, col: 1},
      ];
      assertPositionsEqual(positions, expectedPositions);
      assert.deepEqual(oldPieces, newPieces);
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should give the usual failure response', function() {
      const oldPieces = b.pieces();
      const oldBoard = b.board();
      const { failure, message } = b._place({player: 0, piece: 3, position: {row: 20, col: 0}, probe: true});
      const newPieces = b.pieces();
      const newBoard = b.board();

      assert.isTrue(failure);
      assert.equal(message, 'OutOfBounds');
    });

  });

  describe('placing a transformed piece', function() {

    describe('flipping', function() {

      it('should reflect the piece horizontally', function() {
        const b = blokus();
        b._place({player: 0, piece: 0, position: {row: 0, col: 0}});
        const { positions } = b._place({player: 0, piece: 18, flipped: true, position: {row: 1, col: 1}});

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
        b._place({player: 0, piece: 0, position: {row: 0, col: 0}});
        const { positions } = b._place({player: 0, piece: 18, rotations: 1, position: {row: 1, col: 1}});

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
        b._place({player: 0, piece: 0, position: {row: 0, col: 0}});
        const { positions } = b._place({player: 0, piece: 18, rotations: 2, position: {row: 0, col: 1}});

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
        b._place({player: 0, piece: 0, position: {row: 0, col: 0}});
        const { positions } = b._place({player: 0, piece: 18, rotations: -1, position: {row: 1, col: 1}});

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
        b._place({player: 0, piece: 0, position: {row: 0, col: 0}});
        const { positions } = b._place({player: 0, piece: 18, flipped: true, rotations: 1, position: {row: 1, col: 1}});

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

  describe('getting available pieces', function() {

    it('should get all of a player\'s unused pieces', function() {
      const b = blokus();
      const originalPieces = b.availablePieces({player: 0});

      assert.lengthOf(originalPieces, 21);
      assert.include(_.map(originalPieces, 'id'), 0);

      b._place({player: 0, piece: 0, position: {row: 0, col: 0}});
      const remainingPieces = b.availablePieces({player: 0});

      assert.lengthOf(remainingPieces, 20);
      assert.notInclude(_.map(remainingPieces, 'id'), 0);
    });

    it('should filter a player\'s pieces by number of cells', function() {
      const b = blokus();
      const piecesWith1Cell = b.availablePieces({player: 0, numCells: 1});
      const piecesWith2Cell = b.availablePieces({player: 1, numCells: 2});
      const piecesWith3Cell = b.availablePieces({player: 2, numCells: 3});
      const piecesWith4Cell = b.availablePieces({player: 3, numCells: 4});
      const piecesWith5Cell = b.availablePieces({player: 0, numCells: 5});

      assert.lengthOf(piecesWith1Cell, 1);
      assert.lengthOf(piecesWith2Cell, 1);
      assert.lengthOf(piecesWith3Cell, 2);
      assert.lengthOf(piecesWith4Cell, 5);
      assert.lengthOf(piecesWith5Cell, 12);
    });

  });

});
