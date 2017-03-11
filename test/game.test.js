const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');

const { assertPositionsEqual,
        assertBoardState,     } = require('./testHelpers');
const game = require('../game/game');


describe('game.js', function() {

  describe('instantiating a game', function() {

    it('should make a game', function() {
      const g = game();

      assert.isOk(g);
    });

    describe('turns', function() {

      it('should start with no turns', function() {
        const g = game();
        const turns = g.turns();

        assert.lengthOf(turns, 0);
        assert.deepEqual(turns, []);
      });

    });

  });

  describe('reading the current player', function() {

    it('should start with player 0', function() {
      const g = game();
      const currentPlayer = g.currentPlayer();

      assert.equal(currentPlayer, 0);
    });

    it('should increment the player after a turn is taken', function() {
      const g = game();
      g.place({piece: 0, position: {row: 0, col: 0}});
      const currentPlayer = g.currentPlayer();

      assert.equal(currentPlayer, 1);
    });

    it('should wrap back around to player 0 after player 4', function() {
      const g = game();
      g.place({piece: 0, position: {row: 0, col: 0}});
      g.place({piece: 0, position: {row: 0, col: 19}});
      g.place({piece: 0, position: {row: 19, col: 19}});
      g.place({piece: 0, position: {row: 19, col: 0}});
      const currentPlayer = g.currentPlayer();

      assert.equal(currentPlayer, 0);
    });

  });

  describe('making a placement', function() {

    it('should be able to place a piece', function() {
      const g = game();
      const { success, positions } = g.place({piece: 3, position: {row: 0, col: 0}});

      assert.isTrue(success);
    });

    it('should place a piece in the right position', function() {
      const g = game();
      const { positions } = g.place({piece: 3, position: {row: 0, col: 0}});
      const board = g.board();
      const expectedPositions = [
        {row: 0, col: 0},
        {row: 1, col: 0},
        {row: 1, col: 1},
      ];
      assertPositionsEqual(positions, expectedPositions);
      assertBoardState(board, expectedPositions);
    });

    it('should place the right player\'s piece', function() {
      const g = game();
      const { positions } = g.place({piece: 3, position: {row: 0, col: 0}});
      const board = g.board();

      _.each(positions, ({row, col}) => assert.equal(board[row][col], 0));
    });

    it('should save the placement as a turn', function() {
      const g = game();
      g.place({piece: 0, position: {row: 0, col: 0}});
      const turns = g.turns();

      assert.lengthOf(turns, 1);
      assert.deepEqual(turns, [
        {player: 0, piece: 0, flipped: false, rotations: 0, position: {row: 0, col: 0}},
      ]);
    });

    it('should mark the piece as used', function() {
      const g = game();
      g.place({piece: 3, position: {row: 0, col: 0}});
      const pieces = g.pieces();

      const matchingPiece = _.find(pieces, {player: 0, id: 3});
      assert.isTrue(matchingPiece.used);
    });

    it('should not be able to place a piece that doesn\'t exist', function() {
      const g = game();
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 100, position: {row: 1, col: 1}});
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'PieceDoesNotExist');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece that was already used', function() {
      const g = game();
      g.place({piece: 2, position: {row: 0, col: 0}});
      g.place({piece: 2, position: {row: 0, col: 19}});
      g.place({piece: 2, position: {row: 17, col: 19}});
      g.place({piece: 2, position: {row: 17, col: 0}});
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 2, position: {row: 3, col: 1}});
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'PieceAlreadyUsed');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece with any cells out of bounds', function() {
      const g = game();
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 1, position: {row: 19, col: 0}});
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'OutOfBounds');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece on top of another piece', function() {
      const g = game();
      g.place({piece: 0, position: {row: 0, col: 0}});
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 0, position: {row: 0, col: 0}});
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'Taken');
      assert.deepEqual(oldBoard, newBoard);
    });

  });

  describe('making a first placement', function() {

    const g = game();

    it('should not be able to place a piece anywhere but the corner', function() {
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 0, position: {row: 1, col: 0}});
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'NotInCorner');
      assert.deepEqual(oldBoard, newBoard);
    });

  });

  describe('making a subsequent placement', function() {

    const g = game();
    const placements = [
      {piece: 0, position: {row: 0, col: 0}},
      {piece: 0, position: {row: 0, col: 19}},
      {piece: 0, position: {row: 19, col: 19}},
      {piece: 0, position: {row: 19, col: 0}},
    ];
    _.each(placements, placement => g.place(placement));

    it('should be able to place a piece diagonal from one of the player\'s previous pieces', function() {
      const { success } = g.place({piece: 1, position: {row: 1, col: 1}});
      assert.isTrue(success);
    });

    it('should not be able to place a piece somewhere not diagonal from one of the player\'s previous pieces', function() {
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 1, position: {row: 1, col: 17}});
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'NotDiagonalFromSamePlayer');
      assert.deepEqual(oldBoard, newBoard);
    });

    it('should not be able to place a piece that shares a border with one of the player\'s previous pieces', function() {
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 1, position: {row: 0, col: 18}});
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'AdjacentToSamePlayer');
      assert.deepEqual(oldBoard, newBoard);
    });

  });

  describe('probing a placement', function() {

    const g = game();

    it('should give the usual success response but not change the game state', function() {
      const oldPieces = g.pieces();
      const oldBoard = g.board();
      const { success, positions } = g.place({piece: 3, position: {row: 0, col: 0}, probe: true});
      const newPieces = g.pieces();
      const newBoard = g.board();

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
      const oldPieces = g.pieces();
      const oldBoard = g.board();
      const { failure, message } = g.place({piece: 3, position: {row: 20, col: 0}, probe: true});
      const newPieces = g.pieces();
      const newBoard = g.board();

      assert.isTrue(failure);
      assert.equal(message, 'OutOfBounds');
    });

  });

  describe('placing a transformed piece', function() {

    describe('flipping', function() {

      it('should reflect the piece horizontally', function() {
        const g = game();
        const placements = [
          {piece: 0, position: {row: 0, col: 0}},
          {piece: 0, position: {row: 0, col: 19}},
          {piece: 0, position: {row: 19, col: 19}},
          {piece: 0, position: {row: 19, col: 0}},
        ];
        _.each(placements, placement => g.place(placement));

        const { positions } = g.place({piece: 18, flipped: true, position: {row: 1, col: 0}});

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
        const g = game();
        const placements = [
          {piece: 0, position: {row: 0, col: 0}},
          {piece: 0, position: {row: 0, col: 19}},
          {piece: 0, position: {row: 19, col: 19}},
          {piece: 0, position: {row: 19, col: 0}},
        ];
        _.each(placements, placement => g.place(placement));
        const { positions } = g.place({piece: 18, rotations: 1, position: {row: 0, col: 1}});

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
        const g = game();
        const placements = [
          {piece: 0, position: {row: 0, col: 0}},
          {piece: 0, position: {row: 0, col: 19}},
          {piece: 0, position: {row: 19, col: 19}},
          {piece: 0, position: {row: 19, col: 0}},
        ];
        _.each(placements, placement => g.place(placement));
        const { positions } = g.place({piece: 18, rotations: 2, position: {row: 0, col: 0}});

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
        const g = game();
        const placements = [
          {piece: 0, position: {row: 0, col: 0}},
          {piece: 0, position: {row: 0, col: 19}},
          {piece: 0, position: {row: 19, col: 19}},
          {piece: 0, position: {row: 19, col: 0}},
        ];
        _.each(placements, placement => g.place(placement));
        const { positions } = g.place({piece: 18, rotations: -1, position: {row: 1, col: 1}});

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
        const g = game();
        const placements = [
          {piece: 0, position: {row: 0, col: 0}},
          {piece: 0, position: {row: 0, col: 19}},
          {piece: 0, position: {row: 19, col: 19}},
          {piece: 0, position: {row: 19, col: 0}},
        ];
        _.each(placements, placement => g.place(placement));
        const { positions } = g.place({piece: 18, flipped: true, rotations: 1, position: {row: 1, col: 1}});

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

});