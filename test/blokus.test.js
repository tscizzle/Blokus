const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');

const blokus = require('../blokus');


describe('instantiated blokus', function() {
  it('should exist', function() {
    const b = blokus();

    assert.isOk(b);
  });

  describe('players', function() {
    it('should have the right default players', function() {
      const b = blokus();
      const players = b.players();

      assert.lengthOf(players, 4);
      assert.deepEqual(players, [
        {id: 0, name: 'Player 0', startingPosition: {row: 0,  col: 0}},
        {id: 1, name: 'Player 1', startingPosition: {row: 19, col: 0}},
        {id: 2, name: 'Player 2', startingPosition: {row: 19, col: 19}},
        {id: 3, name: 'Player 3', startingPosition: {row: 0,  col: 19}},
      ]);
    });

    it('should have the passed in players and fill in the remaining spots with default players', function() {
      const b = blokus({height: 10, width: 4, players: ['Jill', 'Bob']});
      const players = b.players();

      assert.lengthOf(players, 4);
      assert.deepEqual(players, [
        {id: 0, name: 'Jill',     startingPosition: {row: 0, col: 0}},
        {id: 1, name: 'Bob',      startingPosition: {row: 9, col: 0}},
        {id: 2, name: 'Player 2', startingPosition: {row: 9, col: 3}},
        {id: 3, name: 'Player 3', startingPosition: {row: 0, col: 3}},
      ]);
    });
  });

  describe('pieces', function() {
    it('should have the right pieces', function() {
      const b = blokus();
      const pieces = b.pieces();

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
      const b = blokus();
      const pieces = b.pieces();

      _.each(pieces, piece => assert.isFalse(piece.used));
    });
  });

  describe('board', function() {
    it('should have the right default dimensions', function() {
      const b = blokus();
      const board = b.board();

      assert.lengthOf(board, 20);
      _.each(board, row => assert.lengthOf(row, 20));
    });

    it('should have the passed in dimensions', function() {
      const tallSkinnyB = blokus({height: 10, width: 1});
      const tallSkinnyBoard = tallSkinnyB.board();

      assert.lengthOf(tallSkinnyBoard, 10);
      _.each(tallSkinnyBoard, row => assert.lengthOf(row, 1));

      const shortFatB = blokus({height: 1, width: 10});
      const shortFatBoard = shortFatB.board();

      assert.lengthOf(shortFatBoard, 1);
      _.each(shortFatBoard, row => assert.lengthOf(row, 10));
    });

    it('should start with an empty board', function() {
      const b = blokus();
      const board = b.board();

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

// TODO: test place (big guns right here)
// TODO: test turns after place
